import "reflect-metadata";
import { DataSource } from "typeorm";
import lockfile from "proper-lockfile";
import { Transporter } from "nodemailer";
import { Channel, Connection } from "amqplib";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { IConsumerFactory } from "types/factories/IConsumerFactory";
import { IDataSourceFactory } from "types/factories/IDataSourceFactory";
import { IMailTransporterFactory } from "types/factories/IMailTransporterFactory";
import { IQueuesConnectionFactory } from "types/factories/IQueuesConnectionFactory";

import { Di } from "@enums/Di";
import { Queue } from "@enums/Queue";
import { Dependency } from "@enums/Dependency";

import { Warden } from "@utils/Warden";
import { setupDi } from "@utils/setupDi";
import { splitPath } from "@helpers/splitPath";
import { getInstanceOf } from "@helpers/getInstanceOf";

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

    const di = await setupDi();

    const dataSource = await getInstanceOf<IDataSourceFactory>(
      Di.DataSourceFactory
    ).create();

    const mailTransporter = getInstanceOf<IMailTransporterFactory>(
      Di.MailTransporterFactory
    ).create();

    const rabbitMQ = await getInstanceOf<IQueuesConnectionFactory>(
      Di.QueuesConnectionFactory
    ).create();

    di.registerOptionalDependencies({
      rabbitMQ,
      dataSource,
      mailTransporter,
    });

    const consumerFactory = getInstanceOf<IConsumerFactory>(Di.ConsumerFactory);

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

  const dataSource = getInstanceOf<DataSource>(Di.DataSource);

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

  const rabbitMQ = getInstanceOf<Connection>(Di.RabbitMQ);

  try {
    await rabbitMQ.close();
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
