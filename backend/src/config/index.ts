import env from "env-var";
import dotenv from "dotenv";

dotenv.config({});

export const APP_PORT: number = env.get("PORT").required().asPortNumber();

export const NODE_ENV: string = env.get("NODE_ENV").required().asString();
