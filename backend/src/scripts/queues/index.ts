import "reflect-metadata";
import "module-alias/register";
import { connect } from "amqplib";

import { MQRABBIT } from "@config";

import { consumer } from "./consumer";
import { publisher } from "./publisher";

const { PORT, USER, PASSWORD } = MQRABBIT;

(async () => {
  const connection = await connect({
    port: PORT,
    username: USER,
    password: PASSWORD,
  });

  try {
    await publisher(connection);

    await consumer(connection);

    console.log("MQRabbit consumer/publisher channels initialized.");
  } catch (error) {
    console.error(error);

    await connection.close();
  }

  process.on("SIGINT", () => {
    if (connection) {
      console.log("Shutting down queues...");

      connection.close();
    }
  });
})();
