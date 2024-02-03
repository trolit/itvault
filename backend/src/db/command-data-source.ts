import { SeederOptions } from "typeorm-extension";
import { DataSource, DataSourceOptions } from "typeorm";

import { DATABASE, APP } from "@config";

import RoleSeeder from "./seeds/1690115009-RoleSeeder";
import PermissionSeeder from "./seeds/1690115077-PermissionSeeder";
import PermissionToRoleSeeder from "./seeds/1690115090-PermissionToRoleSeeder";

import { Environment } from "@enums/Environment";

const { ENV } = APP;
const { HOST, NAME, PORT, TYPE, ROOT } = DATABASE;

const isProduction = ENV === Environment.Production;

const getGlobPattern = (path: string) => `src/db/${path}`;

const options: DataSourceOptions & SeederOptions = {
  type: TYPE,
  host: HOST,
  port: PORT,
  username: ROOT.USERNAME,
  password: ROOT.PASSWORD,
  database: NAME,
  entities: [getGlobPattern(`entities/*`)],
  migrations: [getGlobPattern(`migrations/*`)],
  subscribers: [getGlobPattern(`subscribers/*`)],
  logging: true,
  synchronize: false,

  seeds: isProduction
    ? [RoleSeeder, PermissionSeeder, PermissionToRoleSeeder]
    : [`${getGlobPattern(`seeds/*Seeder*`)}`],
  factories: isProduction ? [] : [`${getGlobPattern(`factories/*`)}`],
};

// @NOTE separate DS config to simplify primary DS (nevertheless of NODE_ENV, TypeORM commands need to reach for src)
export const commandDataSource = new DataSource(options);
