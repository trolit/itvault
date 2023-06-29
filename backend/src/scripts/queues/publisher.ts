import { container } from "tsyringe";
import { Connection } from "amqplib";

import { Di } from "@enums/Di";

export const publisher = async (connection: Connection) => {
  const value = await connection.createChannel();

  container.register(Di.MQPublisher, { useValue: value });

  return value;
};
