import "reflect-metadata";
import lockfile from "proper-lockfile";
import { Transporter } from "nodemailer";
import { dataSource } from "@db/data-source";
import { Channel, Connection, connect } from "amqplib";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import { MQRABBIT } from "@config";

import { Di } from "@enums/Di";
import { Queue } from "@enums/Queue";
import { Service } from "@enums/Service";

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
  try {
    log.debug({
      message: `acquiring lock on file ${splitPath(__filename).pop()}...`,
    });

    await lockfile.lock(__filename);

    log.info({
      message: `creating data source connection...`,
      service: Service.TypeORM,
    });

    await dataSource.initialize();

    log.info({
      message: `creating nodemailer connection...`,
      service: Service.nodemailer,
    });

    mailTransporter = setupMailTransporter();

    log.debug({
      message: `setting up dependency injection...`,
    });

    await setupDi({ mailTransporter });

    const { PORT, USER, PASSWORD } = MQRABBIT;

    log.info({
      message: `establishing amqplib connection...`,
      service: Service.RabbitMQ,
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
      message: `Initialization successful!`,
    });
  } catch (error) {
    console.log(error);

    log.error({
      error,
      message: `Initialization failed!`,
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
    message: `received SHUTDOWN signal`,
  });

  log.info({
    message: `Closing consumer channels...`,
    service: Service.RabbitMQ,
  });

  try {
    await Promise.all(consumerChannels.map(channel => channel.close()));
  } catch (error) {
    log.error({
      error,
      message: `Failed to close consumer channels!`,
      service: Service.RabbitMQ,
    });
  }

  log.info({
    message: `Closing nodemailer channels...`,
    service: Service.nodemailer,
  });

  try {
    mailTransporter.close();
  } catch (error) {
    log.error({
      error,
      message: `Failed to close connection!`,
      service: Service.nodemailer,
    });
  }

  log.info({
    message: `Closing data source connection...`,
    service: Service.TypeORM,
  });

  try {
    await dataSource.destroy();
  } catch (error) {
    log.error({
      error,
      message: `Failed to destroy connection!`,
      service: Service.TypeORM,
    });
  }

  log.info({
    message: `Closing amqplib connection...`,
    service: Service.RabbitMQ,
  });

  try {
    await connection.close();
  } catch (error) {
    log.error({
      error,
      message: `Failed to close connection!`,
      service: Service.RabbitMQ,
    });
  }

  process.exit();
}

process.on("SIGINT", onExit);
process.on("SIGTERM", onExit);
process.on("SIGQUIT", onExit);
