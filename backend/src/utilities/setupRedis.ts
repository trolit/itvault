import { Redis } from "ioredis";

import { REDIS_CONTAINER_PORT, REDIS_PASSWORD } from "@config/index";

export const setupRedis = async () => {
  return new Redis({
    port: REDIS_CONTAINER_PORT,
    password: REDIS_PASSWORD,
  });
};
