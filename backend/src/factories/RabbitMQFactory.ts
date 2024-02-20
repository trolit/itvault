import { connect } from "amqplib";
import { IRabbitMQFactory } from "types/factories/IRabbitMQFactory";

import { RABBITMQ } from "@config";

export class JobFactory implements IRabbitMQFactory {
  create() {
    const { PORT, USER, PASSWORD, HOST } = RABBITMQ;

    return connect({
      hostname: HOST,
      port: PORT,
      username: USER,
      password: PASSWORD,
    });
  }
}
