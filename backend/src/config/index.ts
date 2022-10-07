import env from "env-var";
import dotenv from "dotenv";

dotenv.config({});

export const APP_PORT: number = env.get("PORT").required().asPortNumber();

export const NODE_ENV: string = env.get("NODE_ENV").required().asString();

export const DATABASE_TYPE = env
  .get("DATABASE_TYPE")
  .required()
  .asEnum(["mysql"]);

export const DATABASE_USER: string = env
  .get("DATABASE_USER")
  .required()
  .asString();

export const DATABASE_PASSWORD: string = env
  .get("DATABASE_PASSWORD")
  .required()
  .asString();

export const DATABASE_NAME: string = env
  .get("DATABASE_NAME")
  .required()
  .asString();

export const DATABASE_HOST: string = env
  .get("DATABASE_HOST")
  .required()
  .asString();

export const DATABASE_PORT: number = env
  .get("DATABASE_PORT")
  .required()
  .asPortNumber();
