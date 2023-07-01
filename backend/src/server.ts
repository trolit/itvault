import express from "express";

import { dataSource } from "@config/data-source";

import { setupDi } from "@utils/setupDi";
import { setupRedis } from "@utils/setupRedis";
import { setupRabbit } from "@utils/setupRabbit";
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

  await setupDi(redis.instance);

  await setupRabbit();

  redis.initializeRoleKeys();

  setupExpress(app);

  return app;
};
