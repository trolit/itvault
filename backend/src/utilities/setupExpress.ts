import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import express, { Application } from "express";

import routes from "@routes/index";
import { ROUTES_PREFIX } from "@config/index";

export const setupExpress = (app: Application) => {
  app.use(cors());

  app.use(express.json());

  app.use(helmet());

  app.use(cookieParser());

  app.use(ROUTES_PREFIX, routes);
};
