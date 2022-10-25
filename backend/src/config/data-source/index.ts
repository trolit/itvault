import { SeederOptions } from "typeorm-extension";
import { DataSource, DataSourceOptions } from "typeorm";

import { seeds } from "./seeds";
import { entities } from "./entities";
import { factories } from "./factories";
import { migrations } from "./migrations";

import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PORT,
  DATABASE_TYPE,
  DATABASE_USER,
  DATABASE_ROOT_PASSWORD,
} from "@config/index";

const options: DataSourceOptions & SeederOptions = {
  type: DATABASE_TYPE,
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  username: DATABASE_USER,
  password: DATABASE_ROOT_PASSWORD,
  database: DATABASE_NAME,
  entities,
  migrations,
  logging: true,
  synchronize: false,

  seeds,
  factories,
};

export const dataSource = new DataSource(options);
