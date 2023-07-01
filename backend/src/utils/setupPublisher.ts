import { container } from "tsyringe";

import { Di } from "@enums/Di";
import { IRabbitConnectionFactory } from "@interfaces/factories/IRabbitConnectionFactory";

import { getInstanceOf } from "@helpers/getInstanceOf";

export const setupPublisher = async () => {
  const connectionFactory = getInstanceOf<IRabbitConnectionFactory>(
    Di.RabbitConnectionFactory
  );

  const publisher = await connectionFactory.create();

  container.register(Di.Publisher, { useValue: publisher });
};
