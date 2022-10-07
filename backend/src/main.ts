import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import { APP_PORT, NODE_ENV } from "./config/index";
import { Environment } from "./enums/Environment";

dotenv.config();

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(APP_PORT, () => {
  if (NODE_ENV === Environment.development) {
    console.log(
      `⚡️[server]: Server is running at https://localhost:${APP_PORT}`
    );
  }
});
