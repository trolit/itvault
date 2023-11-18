import "reflect-metadata";
import "module-alias/register";
import { Channel, Connection, connect } from "amqplib";

import { MQRABBIT } from "@config";

import { Di } from "@enums/Di";
import { Queue } from "@enums/Queue";

import { ConsumerFactory } from "@factories/ConsumerFactory";

let consumerChannels: Channel[] = [];
let connection: Connection | null = null;

(async function () {
  const { PORT, USER, PASSWORD } = MQRABBIT;

  connection = await connect({
    port: PORT,
    username: USER,
    password: PASSWORD,
  });

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

  try {
    const consumerFactory = new ConsumerFactory(connection);

    consumerChannels = await Promise.all(
      consumers.map(({ queue, handler }) =>
        consumerFactory.create(queue, handler)
      )
    );
  } catch (error) {
    console.log(error);

    throw "RabbitMQ: Failed to instantiate consumers!!";
  }
});

process.on("SIGINT", async () => {
  if (connection) {
    console.log("RabbitMQ: Closing consumer channels...");

    for (const channel of consumerChannels) {
      await channel.close();
    }

    console.log("RabbitMQ: Closing (queues) connection...");
    await connection.close();
  }
});
