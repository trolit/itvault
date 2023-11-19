import { SeederOptions } from "typeorm-extension";
import { DataSource, DataSourceOptions } from "typeorm";

import { APP, DATABASE } from "@config";

import { Environment } from "@enums/Environment";

const { ENV, WORKING_DIR, _FILE_EXTENSION } = APP;
const { HOST, NAME, PORT, TYPE, ROOT } = DATABASE;

const isProduction = ENV === Environment.Production;

const options: DataSourceOptions & SeederOptions = {
  type: TYPE,
  host: HOST,
  port: PORT,
  username: ROOT.USERNAME,
  password: ROOT.PASSWORD,
  database: NAME,
  entities: [`${WORKING_DIR}/entities/*.${_FILE_EXTENSION}`],
  migrations: [`${WORKING_DIR}/migrations/*.${_FILE_EXTENSION}`],
  logging: true,
  synchronize: false,

  // @TODO
  seeds: isProduction
    ? []
    : [`${WORKING_DIR}/config/data-source/seeds/*.${_FILE_EXTENSION}`],
  factories: isProduction
    ? []
    : [`${WORKING_DIR}/config/data-source/factories/*.${_FILE_EXTENSION}`],
};

export const dataSource = new DataSource(options);
