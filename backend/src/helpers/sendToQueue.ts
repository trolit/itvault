import { Channel } from "amqplib";

import { getInstanceOf } from "./getInstanceOf";

import { Di } from "@enums/Di";
import { Queue } from "@enums/Queue";

export const sendToQueue = <T>(queue: Queue, data: T) => {
  const publisher = getInstanceOf<Channel>(Di.Publisher);

  publisher.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
};
