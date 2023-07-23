import { SeederOptions } from "typeorm-extension";
import { DataSource, DataSourceOptions } from "typeorm";

import { APP, DATABASE } from "@config";

import { Environment } from "@enums/Environment";

const { ENV, WORKING_DIR } = APP;
const { HOST, NAME, PORT, TYPE, ROOT } = DATABASE;

const isProduction = ENV === Environment.Production;

const options: DataSourceOptions & SeederOptions = {
  type: TYPE,
  host: HOST,
  port: PORT,
  username: ROOT.USERNAME,
  password: ROOT.PASSWORD,
  database: NAME,
  entities: [`${WORKING_DIR}/entities/*.{ts,js}`],
  migrations: [`${WORKING_DIR}/migrations/*.{ts,js}`],
  logging: true,
  synchronize: false,

  seeds: isProduction
    ? []
    : [`${WORKING_DIR}/config/data-source/seeds/*.{ts,js}`],
  factories: isProduction
    ? []
    : [`${WORKING_DIR}/config/data-source/factories/*.{ts,js}`],
};

export const dataSource = new DataSource(options);
