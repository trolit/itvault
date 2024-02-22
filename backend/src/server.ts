import express from "express";
import { IDataSourceFactory } from "types/factories/IDataSourceFactory";
import { ISocketServiceManager } from "types/services/ISocketServiceManager";
import { IQueuesConnectionFactory } from "types/factories/IQueuesConnectionFactory";

import { Di } from "@enums/Di";

import { Warden } from "@utils/Warden";
import { setupDi } from "@utils/setupDi";
import { setupJobs } from "@utils/setupJobs";
import { setupRedis } from "@utils/setupRedis";
import { setupExpress } from "@utils/setupExpress";
import { attachEngineIO } from "@utils/attachEngineIO";
import { getInstanceOf } from "@helpers/getInstanceOf";
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
