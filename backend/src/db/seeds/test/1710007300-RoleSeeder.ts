import { DataSource } from "typeorm";
import { Role } from "@db/entities/Role";
import { Seeder } from "typeorm-extension";

import { ALL_PERMISSIONS_ROLE, NO_PERMISSIONS_ROLE } from "./roles";

import {
  ALL_PERMISSIONS_ROLE_ID,
  NO_PERMISSIONS_ROLE_ID,
} from "@shared/constants/tests";

export default class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const repository = dataSource.getRepository(Role);

    await repository.save({
      id: ALL_PERMISSIONS_ROLE_ID,
      name: ALL_PERMISSIONS_ROLE.name,
      description: ALL_PERMISSIONS_ROLE.description,
    });

    await repository.save({
      id: NO_PERMISSIONS_ROLE_ID,
      name: NO_PERMISSIONS_ROLE.name,
      description: NO_PERMISSIONS_ROLE.description,
    });
  }
}
