import { connect } from "amqplib";
import { container } from "tsyringe";

import { MQRABBIT } from "@config";

import { Di } from "@enums/Di";
import { Queue } from "@enums/Queue";

export const setupPublisher = async () => {
  const { PORT, USER, PASSWORD } = MQRABBIT;

  const connection = await connect({
    port: PORT,
    username: USER,
    password: PASSWORD,
  });

  try {
    const publisher = await connection.createChannel();

    const queues = Object.values(Queue);

    queues.map(queue => {
      publisher.assertQueue(queue);
    });

    container.register(Di.Publisher, { useValue: publisher });

    return { connection, channel: publisher };
  } catch (error) {
    console.log(error);

    throw "RabbitMQ: Failed to setup publisher!!";
  }
};
