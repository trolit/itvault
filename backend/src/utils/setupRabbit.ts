import { container } from "tsyringe";
import { Channel, connect, Connection } from "amqplib";

import { MQRABBIT } from "@config";

import { Di } from "@enums/Di";
import { Queue } from "@enums/Queue";

import { ConsumerFactory } from "@factories/ConsumerFactory";

export const setupRabbit = async () => {
  const connection = await initialize();

  const publisher = await createPublisher(connection);

  const consumers = await createConsumers(connection);

  process.on("SIGINT", () => {
    if (connection) {
      console.log("RabbitMQ: Closing publisher channel...");
      publisher.close();

      console.log("RabbitMQ: Closing consumer channels...");
      consumers.map(channel => channel.close());

      console.log("RabbitMQ: Closing connection...");
      connection.close();
    }
  });
};

function initialize() {
  const { PORT, USER, PASSWORD } = MQRABBIT;

  return connect({
    port: PORT,
    username: USER,
    password: PASSWORD,
  });
}

async function createPublisher(connection: Connection) {
  const publisher = await connection.createChannel();

  const queues = Object.values(Queue);

  queues.map(queue => {
    publisher.assertQueue(queue);
  });

  container.register(Di.Publisher, { useValue: publisher });

  return publisher;
}

async function createConsumers(connection: Connection): Promise<Channel[]> {
  const consumers = [
    {
      queue: Queue.GenerateBundle,
      handler: Di.GenerateBundleConsumerHandler,
    },
  ];

  const consumerFactory = new ConsumerFactory(connection);

  try {
    const consumerChannels: Channel[] = await Promise.all(
      consumers.map(({ queue, handler }) =>
        consumerFactory.create(queue, handler)
      )
    );

    console.log("RabbitMQ: consumers initialized.");

    return consumerChannels;
  } catch (error) {
    console.log(error);

    throw "RabbitMQ: Failed to instantiate consumers!!";
  }
}
