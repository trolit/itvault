import { DataSource } from "typeorm";
import { Role } from "@db/entities/Role";
import { Seeder } from "typeorm-extension";

import { HEAD_ADMIN_ROLE, HEAD_ADMIN_ROLE_ID } from "@config/default-roles";

import { TEST_ACCOUNTS } from "./common";

export default class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const repository = dataSource.getRepository(Role);

    for (const { roleName } of TEST_ACCOUNTS) {
      if (roleName === HEAD_ADMIN_ROLE.name) {
        await repository.save({
          id: HEAD_ADMIN_ROLE_ID,
          name: roleName,
          description: "",
        });

        continue;
      }

      await repository.save({
        name: roleName,
        description: "",
      });
    }
  }
}
