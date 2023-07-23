import { SeederOptions } from "typeorm-extension";
import { DataSource, DataSourceOptions } from "typeorm";

import { APP, DATABASE } from "@config";

import { Environment } from "@enums/Environment";

const isProduction = APP.ENV === Environment.Production;

const { HOST, NAME, PORT, TYPE, ROOT } = DATABASE;

const baseDir = isProduction ? "dist" : "src";

const options: DataSourceOptions & SeederOptions = {
  type: TYPE,
  host: HOST,
  port: PORT,
  username: ROOT.USERNAME,
  password: ROOT.PASSWORD,
  database: NAME,
  entities: [`${baseDir}/entities/*.{ts,js}`],
  migrations: [`${baseDir}/migrations/*.{ts,js}`],
  logging: true,
  synchronize: false,

  seeds: isProduction ? [] : [`${baseDir}/config/data-source/seeds/*.{ts,js}`],
  factories: isProduction
    ? []
    : [`${baseDir}/config/data-source/factories/*.{ts,js}`],
};

export const dataSource = new DataSource(options);
