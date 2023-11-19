import "reflect-metadata";
import lockfile from "proper-lockfile";
import { Channel, Connection, connect } from "amqplib";

import { MQRABBIT } from "@config";

import { Di } from "@enums/Di";
import { Queue } from "@enums/Queue";

import { ConsumerFactory } from "@factories/ConsumerFactory";

function logMessage(message: string) {
  console.log(`RabbitMQ: ${message}`);
}

let connection: Connection;
let consumerChannels: Channel[] = [];

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
    await lockfile.lock(__filename);

    const { PORT, USER, PASSWORD } = MQRABBIT;

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

    logMessage("Queues initialized.");
  } catch (error) {
    console.log(error);

    logMessage("Failed to initialize queues!");
  }
})();

process.on("SIGINT", async () => {
  logMessage("Closing consumer channels...");

  try {
    await Promise.all(consumerChannels.map(channel => channel.close()));
  } catch (error) {
    console.log(error);

    logMessage("Failed to (gracefully) close consumer channels...");
  }

  logMessage("Closing connection...");

  try {
    await connection.close();
  } catch (error) {
    console.log(error);

    logMessage("Failed to (gracefully) close (queues) connection...");
  }

  logMessage("Queues shut down.");
});
