import { Connection } from "amqplib";

export interface IRabbitConnectionFactory {
  create(): Promise<Connection>;
}
