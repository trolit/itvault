import { Connection } from "amqplib";

export interface IQueuesConnectionFactory {
  create(): Promise<Connection>;
}
