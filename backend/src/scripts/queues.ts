import "reflect-metadata";
import lockfile from "proper-lockfile";
import { Transporter } from "nodemailer";
import { dataSource } from "@db/data-source";
import { Channel, Connection, connect } from "amqplib";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import { MQRABBIT } from "@config";

import { Di } from "@enums/Di";
import { Queue } from "@enums/Queue";
import { Dependency } from "@enums/Dependency";

import { Warden } from "@utils/Warden";
import { setupDi } from "@utils/setupDi";
import { splitPath } from "@helpers/splitPath";
import { ConsumerFactory } from "@factories/ConsumerFactory";
import { setupMailTransporter } from "@utils/setupMailTransporter";

let connection: Connection;
let consumerChannels: Channel[] = [];
let mailTransporter: Transporter<SMTPTransport.SentMessageInfo>;

const consumers = [
  {
    queue: Queue.GenerateBundle,
    handler: Di.GenerateBundleConsumerHandler,
  },
  {
    queue: Queue.SendMail,
    handler: Di.SendMailConsumerHandler,
  },
];

(async function () {
  Warden.start();

  try {
    log.debug({
      message: `acquiring lock on file ${splitPath(__filename).pop()}...`,
    });

    await lockfile.lock(__filename);

    log.info({
      message: `creating connection...`,
      dependency: Dependency.TypeORM,
    });

    await dataSource.initialize();

    log.info({
      message: `creating connection...`,
      dependency: Dependency.nodemailer,
    });

    mailTransporter = setupMailTransporter();

    log.debug({
      message: `setting up dependency injection...`,
    });

    await setupDi({ mailTransporter });

    const { PORT, USER, PASSWORD } = MQRABBIT;

    log.info({
      message: `establishing connection...`,
      dependency: Dependency.RabbitMQ,
    });

    connection = await connect({
      port: PORT,
      username: USER,
      password: PASSWORD,
    });

    const consumerFactory = new ConsumerFactory(connection);

    consumerChannels = await Promise.all(
      consumers.map(({ queue, handler }) =>
        consumerFactory.create(queue, handler)
      )
    );

    log.info({
      message: `Queues initialization successful!`,
    });
  } catch (error) {
    log.error({
      error,
      message: `Queues initialization failed!`,
    });
  }
})();

async function onExit() {
  log.info({
    message: `received SHUTDOWN signal`,
  });
  log.info({
    message: `received SHUTDOWN signal`,
  });

  log.info({
    message: `Closing consumer channels...`,
    dependency: Dependency.RabbitMQ,
  });

  try {
    await Promise.all(consumerChannels.map(channel => channel.close()));
  } catch (error) {
    log.error({
      error,
      message: `Failed to close consumer channels!`,
      dependency: Dependency.RabbitMQ,
    });
  }

  log.info({
    message: `Closing connection...`,
    dependency: Dependency.nodemailer,
  });

  try {
    mailTransporter.close();
  } catch (error) {
    log.error({
      error,
      message: `Failed to close connection!`,
      dependency: Dependency.nodemailer,
    });
  }

  log.info({
    message: `Closing connection...`,
    dependency: Dependency.TypeORM,
  });

  try {
    await dataSource.destroy();
  } catch (error) {
    log.error({
      error,
      message: `Failed to destroy connection!`,
      dependency: Dependency.TypeORM,
    });
  }

  log.info({
    message: `Closing connection...`,
    dependency: Dependency.RabbitMQ,
  });

  try {
    await connection.close();
  } catch (error) {
    log.error({
      error,
      message: `Failed to close connection!`,
      dependency: Dependency.RabbitMQ,
    });
  }

  process.exit();
}

process.on("SIGINT", onExit);
process.on("SIGTERM", onExit);
process.on("SIGQUIT", onExit);
