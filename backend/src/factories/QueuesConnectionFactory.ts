import { connect } from "amqplib";
import { IQueuesConnectionFactory } from "types/factories/IQueuesConnectionFactory";

import { RABBITMQ } from "@config";

import { Dependency } from "@enums/Dependency";

export class QueuesConnectionFactory implements IQueuesConnectionFactory {
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
