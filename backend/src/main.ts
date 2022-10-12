import dotenv from "dotenv";
import "module-alias/register";
import express, { Express, Request, Response } from "express";

import { db } from "./config/db";
import { Environment } from "./enums/Environment";
import { APP_PORT, NODE_ENV } from "./config/index";

dotenv.config();

const app: Express = express();

// @TMP
try {
  db.initialize();

  console.log("Data Source has been initialized!");
} catch (error) {
  console.error(error);
}

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
