import http from "http";
import express from "express";
import { dataSource } from "@db/data-source";
import { ISocketServiceManager } from "types/services/ISocketServiceManager";

import { Di } from "@enums/Di";
import { Dependency } from "@enums/Dependency";

import { setupDi } from "@utils/setupDi";
import { setupJobs } from "@utils/setupJobs";
import { setupRedis } from "@utils/setupRedis";
import { setupExpress } from "@utils/setupExpress";
import { loadYupUtils } from "@utils/loadYupUtils";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { setupPublisher } from "@utils/setupPublisher";
import { initializeEngineIO } from "@utils/initializeEngineIO";

export const server = async () => {
  const app = express();

  try {
    await loadYupUtils();
  } catch (error) {
    log.error({
      error,
      message: "Failed to load yup utils!",
      dependency: Dependency.yup,
    });

    process.exit(1);
  }

  try {
    await dataSource.initialize();

    log.debug({
      dependency: Dependency.TypeORM,
      message: "Data source initialized!",
    });
  } catch (error) {
    log.error({
      error,
      message: "Failed to initialize data source!",
      dependency: Dependency.TypeORM,
    });

    process.exit(1);
  }

  const engineIo = initializeEngineIO();

  const serverInstance = http.createServer(app);

  engineIo.attach(serverInstance);

  const redis = setupRedis();

  await setupDi({ redis: redis.instance, engineIo });

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
