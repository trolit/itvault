import { DataSource } from "typeorm";
import { Role } from "@db/entities/Role";
import { Seeder } from "typeorm-extension";
import { Permission } from "@db/entities/Permission";
import { PermissionToRole } from "@db/entities/PermissionToRole";

import { ALL_PERMISSIONS } from "@config/permissions";

import { TEST_ACCOUNTS } from "./common";

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
