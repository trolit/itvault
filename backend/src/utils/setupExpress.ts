import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { StatusCodes as HTTP } from "http-status-codes";
import express, { Application, Request, Response } from "express";

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

  app.use((error: Error, request: Request, response: Response) => {
    console.error(error.stack);

    response
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .send("Oops.. Something broke 😢");
  });
};
