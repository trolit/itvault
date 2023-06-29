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

  const publisherChannel = await publisher(connection);

  const consumerChannel = await consumer(connection);

  process.on("SIGTERM", async () => {
    await publisherChannel.close();

    await consumerChannel.close();

    await connection.close();
  });
})();
