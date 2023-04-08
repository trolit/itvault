import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import { Role } from "@entities/Role";
import { TEST_ACCOUNTS } from "./common";

export class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const repository = dataSource.getRepository(Role);

    for (const { roleName } of TEST_ACCOUNTS) {
      await repository.save({
        name: roleName,
      });
    }
  }
}
