import { SeederOptions } from "typeorm-extension";
import { DataSource, DataSourceOptions } from "typeorm";

import { APP, DATABASE } from "@config";

import { seeds } from "./seeds";
import { entities } from "./entities";
import { factories } from "./factories";
import { migrations } from "./migrations";

import { Environment } from "@enums/Environment";

const isProduction = APP.ENV === Environment.Production;

const { HOST, NAME, PORT, TYPE, ROOT } = DATABASE;

const options: DataSourceOptions & SeederOptions = {
  type: TYPE,
  host: HOST,
  port: PORT,
  username: ROOT.USERNAME,
  password: ROOT.PASSWORD,
  database: NAME,
  entities,
  migrations,
  logging: true,
  synchronize: false,

  seeds: isProduction ? [] : seeds,
  factories: isProduction ? [] : factories,
};

export const dataSource = new DataSource(options);
