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

const FILES_LOCAL_STORAGE_BASE_PATH: string = envString(
  "FILES_LOCAL_STORAGE_BASE_PATH"
);

export = {
  app: {
    port: envPort("PORT"),
    url: envString("APP_URL"),
    env: <Environment>envEnum("NODE_ENV", Environment),
    routesPrefix: envString("ROUTES_PREFIX"),
  },

  database: {
    name: envString("DATABASE_NAME"),
    type: <DatabaseType>envEnum("DATABASE_TYPE", DatabaseType),
    root: {
      username: envString("DATABASE_USER"),
      password: envString("DATABASE_ROOT_PASSWORD"),
    },
    host: envString("DATABASE_HOST"),
    port: envPort("DATABASE_PORT"),
  },

  bcrypt: {
    saltRounds: envInt("BCRYPT_SALT_ROUNDS"),
  },

  jwt: {
    secret: envString("JWT_SECRET_KEY"),
    cookieKey: envString("JWT_TOKEN_COOKIE_KEY"),
    tokenLifetimeInSeconds: envFloat("JWT_TOKEN_LIFETIME_IN_HOURS") * 60 * 60,
  },

  redis: {
    port: envInt("REDIS_CONTAINER_PORT"),
    password: envString("REDIS_PASSWORD"),
  },

  files: {
    root: ".",
    storage: {
      mode: FILES_STORAGE_MODE,
      local: {
        basePath: FILES_LOCAL_STORAGE_BASE_PATH,
      },
    },
  },
};

if (FILES_STORAGE_MODE === FileStorageMode.Local) {
  fs.ensureDirSync(FILES_LOCAL_STORAGE_BASE_PATH);
}
