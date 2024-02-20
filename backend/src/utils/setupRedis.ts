import { Redis } from "ioredis";
import { DataStore } from "types/DataStore";
import { IRoleRepository } from "types/repositories/IRoleRepository";

import { REDIS } from "@config";

import { Di } from "@enums/Di";
import { Dependency } from "@enums/Dependency";

import { getInstanceOf } from "@helpers/getInstanceOf";
import { composeDataStoreKey } from "@helpers/composeDataStoreKey";

export const setupRedis = () => {
  log.debug({
    dependency: Dependency.Redis,
    message: "initializing connection...",
  });

  const redis = new Redis({
    host: REDIS.HOST,
    port: REDIS.PORT,
    password: REDIS.PASSWORD,
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

      hdel2: {
        numberOfKeys: 1,
        lua: `
        local keys = redis.call("HKEYS", KEYS[1])

        if table.getn(keys) == 0 then
          return tonumber(0)
        end

        local result = redis.call("HDEL", KEYS[1], unpack(keys))

        return tonumber(result)
        `,
      },
    },
  });

  return {
    instance: redis,

    initializeRoleKeys: async () => {
      const roleRepository = getInstanceOf<IRoleRepository>(Di.RoleRepository);

      const roles = await roleRepository.getAll({
        relations: {
          permissionToRole: {
            permission: true,
          },
        },
      });

      const mutli = redis.multi();

      for (const { id, permissionToRole } of roles) {
        const dataStoreKey = composeDataStoreKey([id, DataStore.KeyType.Role]);

        const value: DataStore.Role = {
          id,
          permissions: permissionToRole.map(({ enabled, permission }) => ({
            signature: permission.signature,
            enabled,
          })),
        };

        mutli.set(dataStoreKey, JSON.stringify(value));
      }

      mutli.exec(error => {
        if (error) {
          log.error({
            error,
            message: "Failed to initialize role keys!",
            dependency: Dependency.Redis,
          });
        }
      });
    },
  };
};
