import { inject } from "tsyringe";
import { Channel, Connection } from "amqplib";

import { Di } from "@enums/Di";
import { Queue } from "@enums/Queue";
import { IBaseConsumerHandler } from "@interfaces/IBaseConsumerHandler";
import { IConsumerFactory } from "@interfaces/factories/IConsumerFactory";

import { getInstanceOf } from "@helpers/getInstanceOf";

export class ConsumerFactory implements IConsumerFactory {
  constructor(
    @inject(Di.RabbitMQ)
    private _rabbitMQ: Connection
  ) {}

  async create<T>(queue: Queue, handler: Di): Promise<Channel> {
    const channel = await this._rabbitMQ.createChannel();

    await channel.assertQueue(queue);

    channel.consume(queue, async message => {
      if (message === null) {
        console.log("Consumer not completed.");

        return;
      }

      const instance = getInstanceOf<IBaseConsumerHandler<T>>(handler);

      const isSuccessful = await instance.handle(<T>message);

      if (isSuccessful) {
        channel.ack(message);

        console.log(`${queue} consumer completed task.`);

        return;
      }

      channel.nack(message, false, false);

      console.log(`${queue} consumer failed to complete task.`);
    });

    return channel;
  }
}
