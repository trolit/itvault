import env from "env-var";
import dotenv from "dotenv";

dotenv.config({});

import { Environment } from "@enums/Environment";
import { DatabaseType } from "@enums/DatabaseType";

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

export const ROUTES_PREFIX: string = env
  .get("ROUTES_PREFIX")
  .required()
  .asString();

export const BCRYPT_SALT_ROUNDS: number = env
  .get("BCRYPT_SALT_ROUNDS")
  .required()
  .asInt();

export const JWT_SECRET_KEY: string = env
  .get("JWT_SECRET_KEY")
  .required()
  .asString();

export const JWT_TOKEN_LIFETIME: string = env
  .get("JWT_TOKEN_LIFETIME")
  .required()
  .asString();
