import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import { Role } from "@entities/Role";
import { TEST_ACCOUNTS } from "./common";
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

      permissions.map(async permissionId => {
        await permissionToRoleRepository.save({
          enabled: true,
          roleId: role.id,
          permissionId,
        });
      });
    }
  }
}
