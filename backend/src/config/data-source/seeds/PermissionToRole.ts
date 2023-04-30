import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import { Role } from "@entities/Role";
import { TEST_ACCOUNTS } from "./common";
import { ALL_PERMISSIONS } from "@config/permissions";
import { PermissionToRole } from "@entities/PermissionToRole";

export class PermissionToRoleSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const roleRepository = dataSource.getRepository(Role);

    const permissionToRoleRepository =
      dataSource.getRepository(PermissionToRole);

    for (const { roleName, permissions } of TEST_ACCOUNTS) {
      const role = await roleRepository.findOneBy({ name: roleName });

      if (!role) {
        continue;
      }

      ALL_PERMISSIONS.map(async permission => {
        const isPermissionEnabled = permissions.some(
          permissionId => permissionId === permission.id
        );

        await permissionToRoleRepository.save({
          roleId: role.id,
          permissionId: permission.id,
          enabled: isPermissionEnabled,
        });
      });
    }
  }
}
