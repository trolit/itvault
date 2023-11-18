import express from "express";

import { dataSource } from "@config/data-source";

import { setupDi } from "@utils/setupDi";
import { setupJobs } from "@utils/setupJobs";
import { setupRedis } from "@utils/setupRedis";
import { setupExpress } from "@utils/setupExpress";
import { loadYupUtils } from "@utils/loadYupUtils";
import { setupPublisher } from "@utils/setupPublisher";
import { setupMailTransporter } from "@utils/setupMailTransporter";

export const server = async () => {
  const app = express();

  await loadYupUtils();

  try {
    await dataSource.initialize();

    console.info("DataSource initialized.");
  } catch (error) {
    console.error(error);
  }

  const redis = setupRedis();

  const mailTransporter = setupMailTransporter();

  await setupDi(redis.instance, mailTransporter);

  await setupPublisher();

  redis.initializeRoleKeys();

  await setupJobs();

  await setupExpress(app);

  return app;
};
