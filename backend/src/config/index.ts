import env from "env-var";
import dotenv from "dotenv";

dotenv.config({});

import { Environment } from "../enums/Environment";
import { DatabaseType } from "../enums/DatabaseType";

export const APP_PORT: number = env.get("PORT").required().asPortNumber();

export const NODE_ENV: Environment = env
  .get("NODE_ENV")
  .required()
  .asEnum(Object.values(Environment));

export const DATABASE_TYPE: DatabaseType = env
  .get("DATABASE_TYPE")
  .required()
  .asEnum(Object.values(DatabaseType));

export const DATABASE_USER: string = env
  .get("DATABASE_USER")
  .required()
  .asString();

export const DATABASE_ROOT_PASSWORD: string = env
  .get("DATABASE_ROOT_PASSWORD")
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
