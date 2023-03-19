import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import { Role } from "@entities/Role";
import { HEAD_ADMIN_ROLE_NAME } from "@config/roles";
import { ALL_PERMISSIONS } from "@config/permissions";
import { PermissionToRole } from "@entities/PermissionToRole";

export class PermissionToRoleSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const roleRepository = dataSource.getRepository(Role);

    const role = await roleRepository.findOneBy({ name: HEAD_ADMIN_ROLE_NAME });

    if (!role) {
      return;
    }

    const permissionToRoleRepository =
      dataSource.getRepository(PermissionToRole);

    ALL_PERMISSIONS.map(async permission => {
      await permissionToRoleRepository.save({
        enabled: true,
        roleId: role.id,
        permissionId: permission.id,
      });
    });
  }
}
