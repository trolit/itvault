import { GenericContainer } from "testcontainers";

import { APP, DATABASE, RABBITMQ, REDIS } from "@config";

import { Environment } from "@enums/Environment";

export const containers = {
  up: getContainers,
  down: async () => {
    const containers = await getContainers();

    for (const container of containers) {
      await container.stop();
    }
  },
};

(async () => {
  const isUp = !!~process.argv.indexOf("--up");

  if (!isUp) {
    return;
  }

  if (APP.ENV !== Environment.Test) {
    throw Error(
      `Attempted to up containers related to test environment while NODE_ENV = ${APP.ENV}!!`
    );
  }

  await containers.up();
})();

async function getContainers() {
  const mysql = await getMySqlContainer();
  const redis = await getRedisContainer();
  const rabbitMQ = await getRabbitMQContainer();

  return [mysql, redis, rabbitMQ];
}

function getMySqlContainer() {
  return new GenericContainer("mysql:8.0")
    .withReuse()
    .withEnvironment({
      MYSQL_DATABASE: DATABASE.NAME,
      MYSQL_ROOT_PASSWORD: DATABASE.ROOT.PASSWORD,
    })
    .withExposedPorts({
      host: DATABASE.PORT,
      container: DATABASE.PORT,
    })
    .start();
}

function getRedisContainer() {
  return new GenericContainer("bitnami/redis")
    .withReuse()
    .withEnvironment({
      REDIS_PASSWORD: REDIS.PASSWORD,
    })
    .withExposedPorts({
      host: REDIS.PORT,
      container: REDIS.PORT,
    })
    .start();
}

function getRabbitMQContainer() {
  return new GenericContainer("rabbitmq:3.12")
    .withReuse()
    .withEnvironment({
      RABBITMQ_DEFAULT_USER: RABBITMQ.USER,
      RABBITMQ_DEFAULT_PASS: RABBITMQ.PASSWORD,
    })
    .withExposedPorts({
      host: RABBITMQ.PORT,
      container: RABBITMQ.PORT,
    })
    .start();
}
