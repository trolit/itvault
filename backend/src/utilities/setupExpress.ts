import cors from "cors";
import express, { Application } from "express";

import routes from "@routes/index";

export const setupExpress = (app: Application) => {
  app.use(cors());

  app.use(express.json());

  app.use(`/api`, routes);
};
