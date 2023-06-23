import { DataSource } from "typeorm";
import { TEST_ACCOUNTS } from "./common";
import { Seeder } from "typeorm-extension";

import { HEAD_ADMIN_ROLE, HEAD_ADMIN_ROLE_ID } from "@config/default-roles";

import { Role } from "@entities/Role";

export class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const repository = dataSource.getRepository(Role);

    for (const { roleName } of TEST_ACCOUNTS) {
      if (roleName === HEAD_ADMIN_ROLE.name) {
        await repository.save({
          id: HEAD_ADMIN_ROLE_ID,
          name: roleName,
        });

        continue;
      }

      await repository.save({
        name: roleName,
      });
    }
  }
}
