import { connect } from "amqplib";
import { container } from "tsyringe";

import { MQRABBIT } from "@config";

import { Di } from "@enums/Di";
import { Queue } from "@enums/Queue";
import { Dependency } from "@enums/Dependency";

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

    log.debug({
      dependency: Dependency.RabbitMQ,
      message: `Publisher initialized.`,
    });

    return { connection, channel: publisher };
  } catch (error) {
    log.error({
      error,
      dependency: Dependency.RabbitMQ,
      message: `Failed to setup publisher!`,
    });

    throw "RabbitMQ: Failed to setup publisher!!";
  }
};
