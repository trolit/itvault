import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import { Permission } from "@entities/Permission";
import { ALL_PERMISSIONS } from "@config/permissions";

export class PermissionSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const repository = dataSource.getRepository(Permission);

    await repository.save(ALL_PERMISSIONS);
  }
}
