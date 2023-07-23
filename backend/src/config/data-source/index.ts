import { SeederOptions } from "typeorm-extension";
import { DataSource, DataSourceOptions } from "typeorm";

import { APP, DATABASE } from "@config";

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
  entities: ["src/entities/*.ts"],
  migrations: ["src/migrations/*.ts"],
  logging: true,
  synchronize: false,

  seeds: isProduction ? [] : ["src/config/data-source/seeds/*.ts"],
  factories: isProduction ? [] : ["src/config/data-source/factories/*.ts"],
};

export const dataSource = new DataSource(options);
