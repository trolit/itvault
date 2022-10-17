import { DataSource } from "typeorm";

import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PORT,
  DATABASE_TYPE,
  DATABASE_USER,
  DATABASE_ROOT_PASSWORD,
} from "@config/index";

export const dataSource = new DataSource({
  type: DATABASE_TYPE,
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  username: DATABASE_USER,
  password: DATABASE_ROOT_PASSWORD,
  database: DATABASE_NAME,
  entities: ["src/entities/*.{ts,js}"],
  migrations: ["src/migrations/*.{ts,js}"],
  logging: true,
  synchronize: false,
});
