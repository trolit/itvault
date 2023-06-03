import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import express, { Application } from "express";

import routes from "@routes";
import { APP } from "@config";

export const setupExpress = (app: Application) => {
  app.use(
    cors({
      credentials: true,
      origin: APP.URL,
    })
  );

  app.use(express.json());

  app.use(helmet());

  app.use(cookieParser());

  app.use(APP.ROUTES_PREFIX, routes);
};
