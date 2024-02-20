import { container } from "tsyringe";
import { Connection } from "amqplib";

import { Di } from "@enums/Di";
import { Queue } from "@enums/Queue";
import { Dependency } from "@enums/Dependency";

export const setupPublisher = async (rabbitMQ: Connection) => {
  log.debug({
    dependency: Dependency.RabbitMQ,
    message: "Initializing publisher...",
  });

  try {
    const publisher = await rabbitMQ.createChannel();

    const queues = Object.values(Queue);

    queues.map(queue => {
      publisher.assertQueue(queue);
    });

    container.register(Di.Publisher, { useValue: publisher });
  } catch (error) {
    log.error({
      error,
      dependency: Dependency.RabbitMQ,
      message: `Failed to setup publisher!`,
    });

    throw "RabbitMQ: Failed to setup publisher!!";
  }
};
