import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import { ALL_PERMISSIONS } from "@config/permissions";

import { TEST_ACCOUNTS } from "./common";

import { Role } from "@entities/Role";
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
          signature => signature === permission.signature
        );

        await permissionToRoleRepository.save({
          role: {
            id: role.id,
          },
          permission: {
            signature: permission.signature,
          },
          enabled: isPermissionEnabled,
        });
      });
    }
  }
}
