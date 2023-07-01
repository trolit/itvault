import { container } from "tsyringe";

import { Di } from "@enums/Di";
import { Queue } from "@enums/Queue";
import { IRabbitConnectionFactory } from "@interfaces/factories/IRabbitConnectionFactory";

import { getInstanceOf } from "@helpers/getInstanceOf";

export const setupPublisher = async () => {
  const connectionFactory = getInstanceOf<IRabbitConnectionFactory>(
    Di.RabbitConnectionFactory
  );

  const connection = await connectionFactory.create();

  const publisher = await connection.createChannel();

  const queues = Object.values(Queue);

  queues.map(queue => {
    publisher.assertQueue(queue);
  });

  container.register(Di.Publisher, { useValue: publisher });
};
