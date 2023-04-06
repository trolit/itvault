import express from "express";

import { setupDi } from "@utilities/setupDi";
import { dataSource } from "@config/data-source";
import { setupRedis } from "@utilities/setupRedis";
import { setupExpress } from "@utilities/setupExpress";

export const server = async () => {
  const app = express();

  try {
    await dataSource.initialize();

    console.info("DataSource initialized.");
  } catch (error) {
    console.error(error);

    process.exit(1);
  }

  const redis = await setupRedis();

  const container = setupDi(redis.instance);

  redis.initializeRoleKeys(container);

  setupExpress(app);

  return app;
};
