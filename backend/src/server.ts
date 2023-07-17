import express from "express";

import { dataSource } from "@config/data-source";

import { setupDi } from "@utils/setupDi";
import { setupRedis } from "@utils/setupRedis";
import { setupRabbit } from "@utils/setupRabbit";
import { setupExpress } from "@utils/setupExpress";
import { setupMailTransporter } from "@utils/setupMailTransporter";

// @TODO util that detects if more permissions were added - if yes - updates DB
export const server = async () => {
  const app = express();

  try {
    await dataSource.initialize();

    console.info("DataSource initialized.");
  } catch (error) {
    console.error(error);
  }

  const redis = setupRedis();

  const mailTransporter = setupMailTransporter();

  await setupDi(redis.instance, mailTransporter);

  await setupRabbit();

  redis.initializeRoleKeys();

  await setupExpress(app);

  return app;
};
