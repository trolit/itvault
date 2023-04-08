import { Redis } from "ioredis";

import { Di } from "@enums/Di";
import { DataStoreRole } from "./DataStoreRole";
import { instanceOf } from "@helpers/instanceOf";
import { DataStoreKeyType } from "@enums/DataStoreKeyType";
import { composeDataStoreKey } from "@helpers/composeDataStoreKey";
import { REDIS_CONTAINER_PORT, REDIS_PASSWORD } from "@config/index";
import { IRoleRepository } from "@interfaces/repository/IRoleRepository";

export const setupRedis = () => {
  const redis = new Redis({
    port: REDIS_CONTAINER_PORT,
    password: REDIS_PASSWORD,
  });

  return {
    instance: redis,

    initializeRoleKeys: async () => {
      const roleRepository = instanceOf<IRoleRepository>(Di.RoleRepository);

      const roles = await roleRepository.getAll();

      const mutli = redis.multi();

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
