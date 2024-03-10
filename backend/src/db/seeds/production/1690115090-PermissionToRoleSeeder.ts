import { DataSource } from "typeorm";
import { Role } from "@db/entities/Role";
import { Seeder } from "typeorm-extension";
import { Permission } from "@db/entities/Permission";
import { PermissionToRole } from "@db/entities/PermissionToRole";

import { INITIAL_ROLES } from "@config/initial-roles";
import { PERMISSIONS_AS_ARRAY } from "@config/permissions";

export default class PermissionToRoleSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const roleRepository = dataSource.getRepository(Role);

    const permissionToRoleRepository =
      dataSource.getRepository(PermissionToRole);

    const permissionRepository = dataSource.getRepository(Permission);

    for (const { name, permissions } of INITIAL_ROLES) {
      const role = await roleRepository.findOneBy({ name });

      if (!role) {
        continue;
      }

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
            id: role.id,
          },
          permission: permissionEntity,
          enabled: isPermissionEnabled,
        });
      });
    }
  }
}
