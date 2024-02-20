import express from "express";
import { IRabbitMQFactory } from "types/factories/IRabbitMQFactory";
import { IDataSourceFactory } from "types/factories/IDataSourceFactory";
import { ISocketServiceManager } from "types/services/ISocketServiceManager";

import { Di } from "@enums/Di";

import { setupDi } from "@utils/setupDi";
import { setupJobs } from "@utils/setupJobs";
import { setupRedis } from "@utils/setupRedis";
import { setupExpress } from "@utils/setupExpress";
import { setupPublisher } from "@utils/setupPublisher";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { attachEngineIO } from "@utils/attachEngineIO";
import { loadYupCustomMethods } from "@utils/loadYupCustomMethods";

export const server = async () => {
  const app = express();
  const { serverInstance, engineIO } = attachEngineIO(app);

  await loadYupCustomMethods();

  const redis = setupRedis();

  const di = await setupDi();

  const dataSource = await getInstanceOf<IDataSourceFactory>(
    Di.DataSourceFactory
  ).create();

  const rabbitMQ = await getInstanceOf<IRabbitMQFactory>(
    Di.RabbitMQFactory
  ).create();

  di.registerOptionalDependencies({
    engineIO,
    rabbitMQ,
    dataSource,
    redis: redis.instance,
  });

  await setupPublisher(rabbitMQ);

  await redis.initializeRoleKeys();

  await setupJobs();

  await setupExpress(app);

  const socketServiceManager = getInstanceOf<ISocketServiceManager>(
    Di.SocketServiceManager
  );

  socketServiceManager.initialize();

  return serverInstance;
};
