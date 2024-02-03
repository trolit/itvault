import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { Permission } from "@db/entities/Permission";

import { PERMISSIONS_AS_ARRAY } from "@config/permissions";

export default class PermissionSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const repository = dataSource.getRepository(Permission);

    await repository.save(PERMISSIONS_AS_ARRAY);
  }
}
