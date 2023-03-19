import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import { Role } from "@entities/Role";
import { ALL_EDITABLE_ROLES, HEAD_ADMIN_ROLE_NAME } from "@config/roles";

export class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const repository = dataSource.getRepository(Role);

    await repository.save({
      name: HEAD_ADMIN_ROLE_NAME,
    });

    await repository.save(ALL_EDITABLE_ROLES.map(({ name }) => ({ name })));
  }
}
