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

const ENV = <Environment>envEnum("NODE_ENV", Environment);

export const APP = {
  PORT: envPort("PORT"),
  URL: envString("APP_URL"),
  ENV,
  ROUTES_PREFIX: envString("ROUTES_PREFIX"),
  IS_CLEARING_TEMPORARY_UPLOADS_DIR: false,
  MAX_ITEMS_PER_PAGE: 20,
  BASE_DIR: ENV === Environment.Production ? "dist" : "src",
  TOTAL_ROLES_LIMIT: envInt("TOTAL_ROLES_LIMIT"),
  IS_PRODUCTION: ENV === Environment.Production,
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
  PORT: envPort("REDIS_PORT"),
  PASSWORD: envString("REDIS_PASSWORD"),
};

export const MQRABBIT = {
  PORT: envPort("RABBITMQ_PORT"),
  USER: envString("RABBITMQ_DEFAULT_USER"),
  PASSWORD: envString("RABBITMQ_DEFAULT_PASSWORD"),
};

export const EMAIL = {
  HOST: envString("EMAIL_HOST"),
  PORT: envPort("EMAIL_PORT"),
  USER: envString("EMAIL_USER"),
  PASSWORD: envString("EMAIL_PASSWORD"),
};

const FILES_STORAGE_MODE: FileStorageMode = envEnum(
  "FILES_STORAGE_MODE",
  FileStorageMode
);
const FILES_BASE_UPLOADS_PATH: string = envString("FILES_BASE_UPLOADS_PATH");
const FILES_BASE_DOWNLOADS_PATH: string = envString(
  "FILES_BASE_DOWNLOADS_PATH"
);
const FILES_BASE_TEMPORARY_UPLOADS_PATH: string = envString(
  "FILES_BASE_TEMPORARY_UPLOADS_PATH"
);

export const FILES = {
  ROOT: ".",
  ACTIVE_MODE: FILES_STORAGE_MODE,
  BASE_UPLOADS_PATH: FILES_BASE_UPLOADS_PATH,
  BASE_DOWNLOADS_PATH: FILES_BASE_DOWNLOADS_PATH,
  BASE_TEMPORARY_UPLOADS_PATH: FILES_BASE_TEMPORARY_UPLOADS_PATH,
  S3: {
    bucket: "itvault-bucket",
    endpoint: envString("S3_ENDPOINT"),
    accessKeyId: envString("S3_ACCESS_KEY_ID"),
    secretAccessKey: envString("S3_SECRET_ACCESS_KEY"),
  },
};

if (FILES_STORAGE_MODE === FileStorageMode.Local) {
  fs.ensureDirSync(FILES_BASE_UPLOADS_PATH);

  fs.ensureDirSync(FILES_BASE_DOWNLOADS_PATH);

  fs.ensureDirSync(FILES_BASE_TEMPORARY_UPLOADS_PATH);
}
