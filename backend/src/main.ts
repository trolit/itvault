import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import { APP_PORT } from "./config/index";

dotenv.config();

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(APP_PORT, () => {
  console.log(
    `⚡️[server]: Server is running at https://localhost:${APP_PORT}`
  );
});
