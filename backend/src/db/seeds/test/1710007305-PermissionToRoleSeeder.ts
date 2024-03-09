import { DataSource } from "typeorm";
import { Role } from "@db/entities/Role";
import { Seeder } from "typeorm-extension";
import { Permission } from "@db/entities/Permission";
import { PermissionToRole } from "@db/entities/PermissionToRole";

import { PERMISSIONS_AS_ARRAY } from "@config/permissions";

import { ALL_PERMISSIONS_ROLE, NO_PERMISSIONS_ROLE } from "./roles";

export default class PermissionToRoleSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const roleRepository = dataSource.getRepository(Role);

    const permissionToRoleRepository =
      dataSource.getRepository(PermissionToRole);

    const permissionRepository = dataSource.getRepository(Permission);

    for (const role of [ALL_PERMISSIONS_ROLE, NO_PERMISSIONS_ROLE]) {
      const { name, permissions } = role;

      const roleRecord = await roleRepository.findOneByOrFail({
        name,
      });

      PERMISSIONS_AS_ARRAY.map(async ({ signature }) => {
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
            id: roleRecord.id,
          },
          permission: permissionEntity,
          enabled: isPermissionEnabled,
        });
      });
    }
  }
}
