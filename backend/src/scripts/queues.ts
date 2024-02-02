import "reflect-metadata";
import lockfile from "proper-lockfile";
import { dataSource } from "@db/data-source";
import { Transporter } from "nodemailer";
import { Channel, Connection, connect } from "amqplib";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import { MQRABBIT } from "@config";

import { Di } from "@enums/Di";
import { Queue } from "@enums/Queue";

import { setupDi } from "@utils/setupDi";
import { splitPath } from "@helpers/splitPath";
import { ConsumerFactory } from "@factories/ConsumerFactory";
import { setupMailTransporter } from "@utils/setupMailTransporter";

function logMessage(message: string) {
  console.log(`[queues]: ${message}`);
}

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
    logMessage(`acquiring lock on file ${splitPath(__filename).pop()}...`);

    await lockfile.lock(__filename);

    logMessage("creating data source connection...");

    await dataSource.initialize();

    logMessage("creating nodemailer connection...");

    mailTransporter = setupMailTransporter();

    logMessage("setting up dependency injection...");

    await setupDi({ mailTransporter });

    const { PORT, USER, PASSWORD } = MQRABBIT;

    logMessage("establishing amqplib connection...");

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

    logMessage("initialization successful!");
  } catch (error) {
    console.log(error);

    logMessage("initialization failed!");
  }
})();

async function onExit() {
  logMessage("received SHUTDOWN signal");
  logMessage("received SHUTDOWN signal");
  logMessage("received SHUTDOWN signal");
  logMessage("received SHUTDOWN signal");

  logMessage("closing consumer channels...");

  try {
    await Promise.all(consumerChannels.map(channel => channel.close()));
  } catch (error) {
    console.log(error);

    logMessage("failed to close consumer channels!");
  }

  logMessage("closing nodemailer connection...");

  try {
    mailTransporter.close();
  } catch (error) {
    console.log(error);

    logMessage("failed to close nodemailer connection!");
  }

  logMessage("closing data source connection...");

  try {
    await dataSource.destroy();
  } catch (error) {
    console.log(error);

    logMessage("failed to destroy data source connection!");
  }

  logMessage("closing amqplib connection...");

  try {
    await connection.close();
  } catch (error) {
    console.log(error);

    logMessage("failed to close amqplib connection!");
  }

  process.exit();
}

process.on("SIGINT", onExit);
process.on("SIGTERM", onExit);
process.on("SIGQUIT", onExit);
