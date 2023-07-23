import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import { ALL_PERMISSIONS } from "@config/permissions";

import { TEST_ACCOUNTS } from "./common";

import { Role } from "@entities/Role";
import { Permission } from "@entities/Permission";
import { PermissionToRole } from "@entities/PermissionToRole";

export default class PermissionToRoleSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const roleRepository = dataSource.getRepository(Role);

    const permissionToRoleRepository =
      dataSource.getRepository(PermissionToRole);

    const permissionRepository = dataSource.getRepository(Permission);

    for (const { roleName, permissions } of TEST_ACCOUNTS) {
      const role = await roleRepository.findOneBy({ name: roleName });

      if (!role) {
        continue;
      }

      ALL_PERMISSIONS.map(async ({ signature }) => {
        const isPermissionEnabled = permissions.some(
          permission => permission.signature === signature
        );

        const permissionEntity = await permissionRepository.findOneOrFail({
          where: {
            signature,
          },
        });

        await permissionToRoleRepository.save({
          role: {
            id: role.id,
          },
          permission: permissionEntity,
          enabled: isPermissionEnabled,
        });
      });
    }
  }
}
