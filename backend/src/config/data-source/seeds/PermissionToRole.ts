import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import { Role } from "@entities/Role";
import { HEAD_ADMIN_ROLE_NAME } from "@config/roles";
import { ALL_PERMISSIONS } from "@config/permissions";
import { PermissionToRole } from "@entities/PermissionToRole";

export class PermissionToRoleSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const permissionToRoleRepository =
      dataSource.getRepository(PermissionToRole);

    const roleRepository = dataSource.getRepository(Role);
  }
}
