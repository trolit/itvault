import { SeederOptions } from "typeorm-extension";
import { DataSource, DataSourceOptions } from "typeorm";

import { DATABASE, APP } from "@config";

import RoleSeeder from "./seeds/1690115009-RoleSeeder";
import PermissionSeeder from "./seeds/1690115077-PermissionSeeder";
import PermissionToRoleSeeder from "./seeds/1690115090-PermissionToRoleSeeder";

const { IS_PRODUCTION, IS_TEST } = APP;
const { HOST, NAME, PORT, TYPE, ROOT } = DATABASE;

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
  // @NOTE [!G] excludes GlobalSubscriber (traces are created manually with seeder)
  subscribers: [getGlobPattern(`subscribers/[!G]*`)],
  logging: true,
  synchronize: false,

  seeds:
    IS_PRODUCTION || IS_TEST
      ? [RoleSeeder, PermissionSeeder, PermissionToRoleSeeder]
      : [`${getGlobPattern(`seeds/*Seeder*`)}`],
  factories: IS_PRODUCTION ? [] : [`${getGlobPattern(`factories/*`)}`],
};

// @NOTE separate DS config to simplify primary DS (nevertheless of NODE_ENV, TypeORM commands need to reach for src)
export const commandDataSource = new DataSource(options);
