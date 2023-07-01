import { Connection, connect } from "amqplib";

import { MQRABBIT } from "@config";

import { IRabbitConnectionFactory } from "@interfaces/factories/IRabbitConnectionFactory";

export class RabbitConnectionFactory implements IRabbitConnectionFactory {
  create(): Promise<Connection> {
    const { PORT, USER, PASSWORD } = MQRABBIT;

    return connect({
      port: PORT,
      username: USER,
      password: PASSWORD,
    });
  }
}
