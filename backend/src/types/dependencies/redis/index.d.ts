// Type definitions for ioredis
import { Redis, Result } from "ioredis";

declare module "ioredis" {
  export interface Redis {
    // @NOTE updates existing hash field
    hfupdate(
      key: string,
      field: string,
      value: string,
      callback?: Callback<string>
    ): Result<number, Context>;

    // @NOTE removes entire hash from redis
    hdel2(key: string, callback?: Callback<string>): Result<number, Context>;
  }
}
