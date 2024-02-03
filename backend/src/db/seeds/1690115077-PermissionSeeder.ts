import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { Permission } from "@db/entities/Permission";

import { PERMISSIONS } from "@config/permissions";

export default class PermissionSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const repository = dataSource.getRepository(Permission);

    await repository.save(Object.values(PERMISSIONS));
  }
}
