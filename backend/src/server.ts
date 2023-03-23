import express from "express";

import { dataSource } from "@config/data-source";
import { setupExpress } from "@utilities/setupExpress";
import { setupDependencyInjection } from "@utilities/setupDependencyInjection";

export const server = async () => {
  const app = express();

  try {
    await dataSource.initialize();

    console.info("DataSource initialized.");
  } catch (error) {
    console.error(error);

    process.exit(1);
  }

  setupDependencyInjection();

  setupExpress(app);

  return app;
};
