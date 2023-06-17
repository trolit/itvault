import env from "env-var";
import fs from "fs-extra";
import dotenv from "dotenv";

dotenv.config({});

import { Environment } from "@enums/Environment";
import { DatabaseType } from "@enums/DatabaseType";
import { FileStorageMode } from "@enums/FileStorageMode";

const envString = (name: string) => env.get(name).required().asString();
const envPort = (name: string) => env.get(name).required().asPortNumber();
const envInt = (name: string) => env.get(name).required().asInt();
const envEnum = <T extends object>(name: string, type: T) =>
  env.get(name).required().asEnum(Object.values(type));
const envFloat = (name: string) => env.get(name).required().asFloat();

const FILES_STORAGE_MODE: FileStorageMode = envEnum(
  "FILES_STORAGE_MODE",
  FileStorageMode
);

const FILES_LOCAL_STORAGE_BASE_UPLOADS_PATH: string = envString(
  "FILES_LOCAL_STORAGE_BASE_UPLOADS_PATH"
);

export const APP = {
  PORT: envPort("PORT"),
  URL: envString("APP_URL"),
  ENV: <Environment>envEnum("NODE_ENV", Environment),
  ROUTES_PREFIX: envString("ROUTES_PREFIX"),
};

export const DATABASE = {
  NAME: envString("DATABASE_NAME"),
  TYPE: <DatabaseType>envEnum("DATABASE_TYPE", DatabaseType),
  ROOT: {
    USERNAME: envString("DATABASE_USER"),
    PASSWORD: envString("DATABASE_ROOT_PASSWORD"),
  },
  HOST: envString("DATABASE_HOST"),
  PORT: envPort("DATABASE_PORT"),
};

export const BCRYPT = {
  SALT_ROUNDS: envInt("BCRYPT_SALT_ROUNDS"),
};

export const JWT = {
  SECRET_KEY: envString("JWT_SECRET_KEY"),
  COOKIE_KEY: envString("JWT_TOKEN_COOKIE_KEY"),
  TOKEN_LIFETIME_IN_SECONDS: envFloat("JWT_TOKEN_LIFETIME_IN_HOURS") * 60 * 60,
};

export const REDIS = {
  PORT: envInt("REDIS_CONTAINER_PORT"),
  PASSWORD: envString("REDIS_PASSWORD"),
};

export const FILES = {
  ROOT: ".",
  STORAGE: {
    MODE: FILES_STORAGE_MODE,
    LOCAL: {
      BASE_UPLOADS_PATH: FILES_LOCAL_STORAGE_BASE_UPLOADS_PATH,
    },
  },
};

if (FILES_STORAGE_MODE === FileStorageMode.Local) {
  fs.ensureDirSync(FILES_LOCAL_STORAGE_BASE_UPLOADS_PATH);
}
