import http from "http";
import express from "express";
import { IDataSourceFactory } from "types/factories/IDataSourceFactory";
import { ISocketServiceManager } from "types/services/ISocketServiceManager";

import { Di } from "@enums/Di";

import { setupDi } from "@utils/setupDi";
import { setupJobs } from "@utils/setupJobs";
import { setupRedis } from "@utils/setupRedis";
import { loadYupUtils } from "@utils/loadYupUtils";
import { setupExpress } from "@utils/setupExpress";
import { setupPublisher } from "@utils/setupPublisher";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { initializeEngineIO } from "@utils/initializeEngineIO";

export const server = async () => {
  const app = express();
  const serverInstance = http.createServer(app);

  await loadYupUtils();

  const engineIo = initializeEngineIO();

  engineIo.attach(serverInstance);

  const redis = setupRedis();

  const di = await setupDi();

  const dataSourceFactory = getInstanceOf<IDataSourceFactory>(
    Di.DataSourceFactory
  );

  const dataSource = await dataSourceFactory.create();

  di.registerAdditionalDependencies({
    engineIo,
    dataSource,
    redis: redis.instance,
  });

  await setupPublisher();

  redis.initializeRoleKeys();

  await setupJobs();

  await setupExpress(app);

  const socketServiceManager = getInstanceOf<ISocketServiceManager>(
    Di.SocketServiceManager
  );

  socketServiceManager.initialize();

  return serverInstance;
};
