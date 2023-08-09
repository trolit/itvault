import { Channel } from "amqplib";

import { Di } from "@enums/Di";
import { Queue } from "@enums/Queue";

export interface IConsumerFactory {
  create(queue: Queue, handler: Di): Promise<Channel>;
}
