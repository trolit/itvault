import express from "express";

import { dataSource } from "@config/dataSource";
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

  setupExpress(app);

  return app;
};
