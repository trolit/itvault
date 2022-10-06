import env from "env-var";
import dotenv from "dotenv";

import { Config } from "../interfaces/Config";
import { DEFAULT_PORT, DEFAULT_NODE_ENV } from "./defaults";

dotenv.config({});

export const config: Config = {
  PORT: env.get("PORT").default(DEFAULT_PORT).asPortNumber(),
  NODE_ENV: env.get("NODE_ENV").default(DEFAULT_NODE_ENV).asString(),
};
