import express from "express";

import { setupDi } from "@utils/setupDi";
import { dataSource } from "@config/data-source";
import { setupRedis } from "@utils/setupRedis";
import { setupExpress } from "@utils/setupExpress";

export const server = async () => {
  const app = express();

  try {
    await dataSource.initialize();

    console.info("DataSource initialized.");
  } catch (error) {
    console.error(error);
  }

  const redis = setupRedis();

  const container = await setupDi(redis.instance);

  redis.initializeRoleKeys(container);

  setupExpress(app);

  return app;
};
