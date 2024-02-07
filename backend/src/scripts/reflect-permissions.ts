import "reflect-metadata";
import { Role } from "@db/entities/Role";
import { DataStore } from "types/DataStore";
import { dataSource } from "@db/data-source";
import { Permission } from "@db/entities/Permission";
import { PermissionToRole } from "@db/entities/PermissionToRole";

import { PERMISSIONS_AS_ARRAY } from "@config/permissions";

import { Service } from "@enums/Service";
import { HEAD_ADMIN_ROLE } from "@shared/constants/config";

import { Warden } from "@utils/Warden";
import { setupRedis } from "@utils/setupRedis";
import { composeDataStoreKey } from "@helpers/composeDataStoreKey";

(async function () {
  Warden.start();

  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.connect();

  await queryRunner.startTransaction();

  const { manager } = queryRunner;

  if (!queryRunner.isTransactionActive) {
    log.error({
      service: Service.TypeORM,
      message: `Failed to start transaction!`,
    });

    return;
  }

  try {
    const implementedPermissions = await manager.find(Permission);

    const signatures = implementedPermissions.map(({ signature }) => signature);

    const missingPermissions = PERMISSIONS_AS_ARRAY.filter(
      ({ signature }) => !signatures.includes(signature)
    );

    if (missingPermissions.length === 0) {
      log.info({
        service: Service.TypeORM,
        message: `Permissions are up to date.`,
      });

      await queryRunner.commitTransaction();

      return;
    }

    const parsedMissingPermissions = missingPermissions.map(
      ({ name, signature }) => {
        return manager.create(Permission, { name, signature });
      }
    );

    const newPermissions = await manager.save(parsedMissingPermissions);

    const allRoles = await manager.find(Role, {
      relations: { permissionToRole: true },
    });

    for (const role of allRoles) {
      for (const newPermission of newPermissions) {
        const permissionToRole = manager.create(PermissionToRole, {
          permission: newPermission,
          role,
          enabled: role.id === HEAD_ADMIN_ROLE.id,
        });

        role.permissionToRole.push(permissionToRole);
      }
    }

    const roles = await manager.save(allRoles);

    log.info({
      service: Service.TypeORM,
      message: `${newPermissions.length} permission(s) were added to the database.`,
    });

    await reflectChangesInRedis(roles);

    await queryRunner.commitTransaction();
  } catch (error) {
    log.error({
      error,
      service: Service.TypeORM,
      message: `An error occurred while reflecting permissions.`,
    });

    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }

  process.exit(0);
})();

async function reflectChangesInRedis(roles: Role[]) {
  const { instance } = setupRedis();

  const mutli = instance.multi();

  for (const { id, permissionToRole } of roles) {
    const dataStoreKey = composeDataStoreKey([id, DataStore.KeyType.Role]);

    const value: DataStore.Role = {
      id,
      permissions: permissionToRole.map(({ enabled, permission }) => ({
        ...permission,
        enabled,
      })),
    };

    mutli.set(dataStoreKey, JSON.stringify(value));
  }

  mutli.exec(error => {
    if (error) {
      log.error({
        error,
        service: Service.Redis,
        message: `An error occurred while reflecting permissions.`,
      });
    }
  });

  await instance.quit();
}
