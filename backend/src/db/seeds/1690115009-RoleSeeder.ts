import { DataSource } from "typeorm";
import { Role } from "@db/entities/Role";
import { Seeder } from "typeorm-extension";

import { TEST_ACCOUNTS } from "./common";

import { HEAD_ADMIN_ROLE } from "@shared/constants/config";

export default class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const repository = dataSource.getRepository(Role);

    for (const { roleName } of TEST_ACCOUNTS) {
      if (roleName === HEAD_ADMIN_ROLE.name) {
        await repository.save({
          id: HEAD_ADMIN_ROLE.id,
          name: HEAD_ADMIN_ROLE.name,
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
