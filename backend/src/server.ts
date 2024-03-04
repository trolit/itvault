import Redis from "ioredis";
import express from "express";
import { DataSource } from "typeorm";
import { Channel, Connection } from "amqplib";
import { IDataSourceFactory } from "types/factories/IDataSourceFactory";
import { ISocketServiceManager } from "types/services/ISocketServiceManager";
import { IQueuesConnectionFactory } from "types/factories/IQueuesConnectionFactory";

import { Di } from "@enums/Di";
import { Dependency } from "@enums/Dependency";

import { Warden } from "@utils/Warden";
import { setupDi } from "@utils/setupDi";
import { setupJobs } from "@utils/setupJobs";
import { setupRedis } from "@utils/setupRedis";
import { setupExpress } from "@utils/setupExpress";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { attachEngineIO } from "@utils/attachEngineIO";
import { setupPublisher } from "@utils/setupPublisher";
import { loadYupCustomMethods } from "@utils/loadYupCustomMethods";

export const server = async () => {
  Warden.start();

  const app = express();
  const { serverInstance, engineIO } = attachEngineIO(app);

  await loadYupCustomMethods();

  const redis = setupRedis();

  const di = await setupDi();

  const dataSource = await getInstanceOf<IDataSourceFactory>(
    Di.DataSourceFactory
  ).create();

  const rabbitMQ = await getInstanceOf<IQueuesConnectionFactory>(
    Di.QueuesConnectionFactory
  ).create();

  di.registerExternalDependencies({
    engineIO,
    rabbitMQ,
    dataSource,
    redis: redis.instance,
  });

  await setupPublisher(rabbitMQ);

  await redis.seedWithRoles();

  await setupJobs();

  await setupExpress(app);

  getInstanceOf<ISocketServiceManager>(Di.SocketServiceManager).initialize();

  return serverInstance;
};

export async function onExit(beforeExit?: () => Promise<void>) {
  await closePublisher();

  await closeQueuesConnection();

  await closeRedisConnection();

  await closeDatabaseConnection();

  if (beforeExit && typeof beforeExit === "function") {
    await beforeExit();
  }

  process.exit();
}

async function closePublisher() {
  log.info({
    message: `Closing publisher channel...`,
    dependency: Dependency.RabbitMQ,
  });

  const publisher = getInstanceOf<Channel>(Di.Publisher);

  try {
    await publisher.close();
  } catch (error) {
    log.error({
      error,
      message: `Failed to close publisher channel!`,
      dependency: Dependency.RabbitMQ,
    });
  }
}

async function closeQueuesConnection() {
  log.info({
    message: `Closing connection...`,
    dependency: Dependency.RabbitMQ,
  });

  const rabbitMQ = getInstanceOf<Connection>(Di.RabbitMQ);

  try {
    await rabbitMQ.close();
  } catch (error) {
    log.error({
      error,
      message: `Failed to close connection!`,
      dependency: Dependency.RabbitMQ,
    });
  }
}

async function closeRedisConnection() {
  log.info({
    message: `Closing connection...`,
    dependency: Dependency.Redis,
  });

  const redis = getInstanceOf<Redis>(Di.Redis);

  try {
    redis.disconnect();
  } catch (error) {
    log.error({
      error,
      message: `Failed to close connection!`,
      dependency: Dependency.Redis,
    });
  }
}

async function closeDatabaseConnection() {
  log.info({
    message: `Closing connection...`,
    dependency: Dependency.TypeORM,
  });

  const dataSource = getInstanceOf<DataSource>(Di.DataSource);

  try {
    await dataSource.destroy();
  } catch (error) {
    log.error({
      error,
      message: `Failed to destroy connection!`,
      dependency: Dependency.TypeORM,
    });
  }
}
