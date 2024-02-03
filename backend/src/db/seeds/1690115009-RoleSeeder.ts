import { DataSource } from "typeorm";
import { Role } from "@db/entities/Role";
import { Seeder } from "typeorm-extension";

import { INITIAL_ROLES } from "@config/initial-roles";

import { HEAD_ADMIN_ROLE } from "@shared/constants/config";

export default class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const repository = dataSource.getRepository(Role);

    for (const { name, description } of INITIAL_ROLES) {
      if (name === HEAD_ADMIN_ROLE.name) {
        await repository.save({
          id: HEAD_ADMIN_ROLE.id,
          name: HEAD_ADMIN_ROLE.name,
          description,
        });

        continue;
      }

      await repository.save({
        name,
        description,
      });
    }
  }
}
