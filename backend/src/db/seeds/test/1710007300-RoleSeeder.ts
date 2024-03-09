import { DataSource } from "typeorm";
import { Role } from "@db/entities/Role";
import { Seeder } from "typeorm-extension";

import { ALL_PERMISSIONS_ROLE, NO_PERMISSIONS_ROLE } from "./roles";

import { HEAD_ADMIN_ROLE } from "@shared/constants/config";

export default class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const repository = dataSource.getRepository(Role);

    await repository.save({
      id: HEAD_ADMIN_ROLE.id,
      name: ALL_PERMISSIONS_ROLE.name,
      description: ALL_PERMISSIONS_ROLE.description,
    });

    await repository.save({
      name: NO_PERMISSIONS_ROLE.name,
      description: NO_PERMISSIONS_ROLE.description,
    });
  }
}
