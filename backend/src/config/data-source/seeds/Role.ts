import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import {
  ALL_EDITABLE_ROLES,
  HEAD_ADMIN_ROLE_NAME,
} from "@config/default-roles";
import { Role } from "@entities/Role";

export class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const repository = dataSource.getRepository(Role);

    await repository.save({
      name: HEAD_ADMIN_ROLE_NAME,
    });

    await repository.save(ALL_EDITABLE_ROLES.map(({ name }) => ({ name })));
  }
}
