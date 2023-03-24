import express from "express";

import { setupDi } from "@utilities/setupDi";
import { dataSource } from "@config/data-source";
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

  setupDi();

  setupExpress(app);

  return app;
};
