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
    enableAutoPipelining: true,
    scripts: {
      hfupdate: {
        numberOfKeys: 1,
        lua: `
        if redis.call("HEXISTS", KEYS[1], ARGV[1]) == 1 then
          local result = redis.call("HSET", KEYS[1], ARGV[1], ARGV[2])

          if result ~= nil then
            return tonumber(1)
          else
            return tonumber(0)
          end
        else
          return tonumber(0)
        end`,
      },
    },
  });

  return {
    instance: redis,

    initializeRoleKeys: async () => {
      const roleRepository = instanceOf<IRoleRepository>(Di.RoleRepository);

      const roles = await roleRepository.getAll();

      const mutli = redis.multi();

      for (const { id, permissionToRole } of roles) {
        const dataStoreKey = composeDataStoreKey([id, DataStoreKeyType.Role]);

        const value: DataStoreRole = {
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
          console.log(error);
        }
      });
    },
  };
};
