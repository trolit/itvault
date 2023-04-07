import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import express, { Application } from "express";

import routes from "@routes";
import { ROUTES_PREFIX, APP_URL } from "@config";

export const setupExpress = (app: Application) => {
  app.use(
    cors({
      credentials: true,
      origin: APP_URL,
    })
  );

  app.use(express.json());

  app.use(helmet());

  app.use(cookieParser());

  app.use(ROUTES_PREFIX, routes);
};
