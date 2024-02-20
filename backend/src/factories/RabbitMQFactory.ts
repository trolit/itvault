import { connect } from "amqplib";
import { IRabbitMQFactory } from "types/factories/IRabbitMQFactory";

import { RABBITMQ } from "@config";

import { Dependency } from "@enums/Dependency";

export class RabbitMQFactory implements IRabbitMQFactory {
  create() {
    const { PORT, USER, PASSWORD, HOST } = RABBITMQ;

    log.debug({
      message: `Creating connection...`,
      dependency: Dependency.RabbitMQ,
    });

    return connect({
      hostname: HOST,
      port: PORT,
      username: USER,
      password: PASSWORD,
    });
  }
}
