import "reflect-metadata";
import "module-alias/register";
import { Channel, connect } from "amqplib";

import { MQRABBIT } from "@config";

import { publisher } from "./publisher";

import { Di } from "@enums/Di";
import { Queue } from "@enums/Queue";
import { IConsumerFactory } from "@interfaces/factories/IConsumerFactory";

import { getInstanceOf } from "@helpers/getInstanceOf";

const { PORT, USER, PASSWORD } = MQRABBIT;

const consumers = [
  {
    queue: Queue.GenerateBundle,
    handler: Di.GenerateBundleConsumerHandler,
  },
];

(async () => {
  const connection = await connect({
    port: PORT,
    username: USER,
    password: PASSWORD,
  });

  await publisher(connection);

  const consumerFactory = getInstanceOf<IConsumerFactory>(Di.ConsumerFactory);

  let consumerChannels: Channel[] = [];

  try {
    consumerChannels = await Promise.all(
      consumers.map(({ queue, handler }) =>
        consumerFactory.create(queue, handler)
      )
    );

    console.log("MQRabbit consumer/publisher channels initialized.");
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
