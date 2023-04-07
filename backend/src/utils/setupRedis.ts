import { Redis } from "ioredis";
import { DependencyContainer } from "tsyringe";

import { Di } from "@enums/Di";
import { DataStoreRole } from "./DataStoreRole";
import { DataStoreKeyType } from "@enums/DataStoreKeyType";
import { composeDataStoreKey } from "@helpers/composeDataStoreKey";
import { REDIS_CONTAINER_PORT, REDIS_PASSWORD } from "@config/index";
import { IRoleRepository } from "@interfaces/repository/IRoleRepository";

export const setupRedis = () => {
  const instance = new Redis({
    port: REDIS_CONTAINER_PORT,
    password: REDIS_PASSWORD,
  });

  return {
    instance,

    initializeRoleKeys: async (container: DependencyContainer) => {
      const roleRepository = container.resolve<IRoleRepository>(
        Di.RoleRepository
      );

      const roles = await roleRepository.getAll();

      const mutli = instance.multi();

      for (const { id, permissionToRole } of roles) {
        const key = composeDataStoreKey(id.toString(), DataStoreKeyType.Role);

        const value: DataStoreRole = {
          id,
          permissions: permissionToRole.map(({ enabled, permission }) => ({
            ...permission,
            enabled,
          })),
        };

        mutli.set(key, JSON.stringify(value));
      }

      mutli.exec(error => {
        if (error) {
          console.log(error);
        }
      });
    },
  };
};
