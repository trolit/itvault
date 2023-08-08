import { Channel, Connection } from "amqplib";

import { Di } from "@enums/Di";
import { Queue } from "@enums/Queue";
import { IBaseConsumerHandler } from "@interfaces/IBaseConsumerHandler";
import { IConsumerFactory } from "@interfaces/factories/IConsumerFactory";

import { getInstanceOf } from "@helpers/getInstanceOf";

export class ConsumerFactory implements IConsumerFactory {
  constructor(private _rabbitMQ: Connection) {}

  async create(queue: Queue, handler: Di): Promise<Channel> {
    const channel = await this._rabbitMQ.createChannel();

    await channel.assertQueue(queue);

    channel.consume(queue, async message => {
      if (message === null) {
        console.log("RabbitMQ: Consumer cancelled by server.");

        return;
      }

      const instance = getInstanceOf<IBaseConsumerHandler<unknown>>(handler);

      const content = message.content.toString();

      const data = JSON.parse(content);

      const isSuccessful = await instance.handle(data);

      if (isSuccessful) {
        channel.ack(message);

        console.log(`RabbitMQ: consumer completed task of ${queue} queue.`);

        return;
      }

      await instance.onError(data);

      channel.nack(message, false, false);

      console.log(
        `RabbitMQ: consumer failed to complete task of ${queue} queue.`
      );
    });

    return channel;
  }
}
