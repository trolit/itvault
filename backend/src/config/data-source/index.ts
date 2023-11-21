import { SeederOptions } from "typeorm-extension";
import { DataSource, DataSourceOptions } from "typeorm";

import { APP, DATABASE } from "@config";

import { Environment } from "@enums/Environment";

const { ENV, BASE_DIR } = APP;
const { HOST, NAME, PORT, TYPE, ROOT } = DATABASE;

const isProduction = ENV === Environment.Production;

const options: DataSourceOptions & SeederOptions = {
  type: TYPE,
  host: HOST,
  port: PORT,
  username: ROOT.USERNAME,
  password: ROOT.PASSWORD,
  database: NAME,
  entities: [`${BASE_DIR}/entities/*`],
  migrations: [`${BASE_DIR}/migrations/*`],
  subscribers: [`${BASE_DIR}/subscribers/*`],
  logging: true,
  synchronize: false,

  // @TODO
  seeds: isProduction ? [] : [`${BASE_DIR}/config/data-source/seeds/*`],
  factories: isProduction ? [] : [`${BASE_DIR}/config/data-source/factories/*`],
};

export const dataSource = new DataSource(options);
