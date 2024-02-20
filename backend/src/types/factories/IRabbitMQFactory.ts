import { Connection } from "amqplib";

export interface IRabbitMQFactory {
  create(): Promise<Connection>;
}
