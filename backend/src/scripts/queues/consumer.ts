import { Connection } from "amqplib";

export const consumer = async (connection: Connection) => {
  const value = await connection.createChannel();

  // @TODO

  return value;
};
