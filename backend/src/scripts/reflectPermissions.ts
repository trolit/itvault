import "reflect-metadata";
import "module-alias/register";

import { dataSource } from "@config/data-source";
import { ALL_PERMISSIONS } from "@config/permissions";
import { HEAD_ADMIN_ROLE_ID } from "@config/default-roles";

import { Role } from "@entities/Role";
import { Permission } from "@entities/Permission";
import { PermissionToRole } from "@entities/PermissionToRole";

(async function reflectPermissions() {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.connect();

  await queryRunner.startTransaction();

  const { manager } = queryRunner;

  if (!queryRunner.isTransactionActive) {
    console.log("TypeORM: Failed to start transaction.");

    return;
  }

  try {
    const implementedPermissions = await manager.find(Permission);

    const signatures = implementedPermissions.map(({ signature }) => signature);

    console.log(ALL_PERMISSIONS);

    const missingPermissions = ALL_PERMISSIONS.filter(
      ({ signature }) => !signatures.includes(signature)
    );

    if (missingPermissions.length === 0) {
      console.log("TypeORM: permissions are up to date.");

      await queryRunner.commitTransaction();

      return;
    }

    const parsedMissingPermissions = missingPermissions.map(
      ({ name, signature }) => {
        return manager.create(Permission, { name, signature });
      }
    );

    const newPermissions = await manager.save(parsedMissingPermissions);

    const allRoles = await manager.find(Role);

    for (const role of allRoles) {
      for (const newPermission of newPermissions) {
        const permissionToRole = manager.create(PermissionToRole, {
          permission: newPermission,
          role,
          enabled: role.id === HEAD_ADMIN_ROLE_ID ? true : false,
        });

        role.permissionToRole.push(permissionToRole);
      }
    }

    await manager.save(allRoles);

    console.log(
      `TypeORM: ${
        newPermissions.length
      } permissions were added to the database (${signatures.join(", ")}).`
    );

    await queryRunner.commitTransaction();
  } catch (error) {
    console.log(error);

    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();

    process.exit(0);
  }
})();
