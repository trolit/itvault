import "reflect-metadata";
import "module-alias/register";
import { Channel } from "amqplib";

import { Di } from "@enums/Di";
import { Queue } from "@enums/Queue";

import { ConsumerFactory } from "@factories/ConsumerFactory";
import { RabbitConnectionFactory } from "@factories/RabbitConnectionFactory";

const consumers = [
  {
    queue: Queue.GenerateBundle,
    handler: Di.GenerateBundleConsumerHandler,
  },
];

const connectionFactory = new RabbitConnectionFactory();

(async () => {
  const connection = await connectionFactory.create();

  const consumerFactory = new ConsumerFactory(connection);

  let consumerChannels: Channel[] = [];

  try {
    consumerChannels = await Promise.all(
      consumers.map(({ queue, handler }) =>
        consumerFactory.create(queue, handler)
      )
    );

    console.log("MQRabbit consumers initialized.");
  } catch (error) {
    console.error(error);

    await connection.close();
  }

  process.on("SIGINT", () => {
    if (connection) {
      console.log("Closing consumer channels...");
      consumerChannels.map(channel => channel.close());

      console.log("Shutting down queues...");

      connection.close();
    }
  });
})();
