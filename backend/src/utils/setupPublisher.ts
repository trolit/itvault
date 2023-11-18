import { container } from "tsyringe";
import { Channel, Connection, connect } from "amqplib";

import { MQRABBIT } from "@config";

import { Di } from "@enums/Di";
import { Queue } from "@enums/Queue";

let publisher: Channel;
let connection: Connection | null = null;

export const setupPublisher = async () => {
  const { PORT, USER, PASSWORD } = MQRABBIT;

  connection = await connect({
    port: PORT,
    username: USER,
    password: PASSWORD,
  });

  try {
    publisher = await connection.createChannel();

    const queues = Object.values(Queue);

    queues.map(queue => {
      publisher.assertQueue(queue);
    });

    container.register(Di.Publisher, { useValue: publisher });
  } catch (error) {
    console.log(error);

    throw "RabbitMQ: Failed to setup publisher!!";
  }
};

process.on("SIGINT", async () => {
  if (connection) {
    console.log("RabbitMQ: Closing publisher channel...");
    await publisher.close();

    console.log("RabbitMQ: Closing (publisher) connection...");
    await connection.close();
  }
});
