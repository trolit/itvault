// Type definitions for ioredis
import { Callback, Redis, Result } from "ioredis";

declare module "ioredis" {
  export interface Redis {
    // @NOTE updates existing hash field
    hfupdate(
      key: string,
      field: string,
      value: string,
      callback?: Callback<string>
    ): Result<number, any>;

    // @NOTE removes entire hash from redis
    hdel2(key: string, callback?: Callback<string>): Result<number, any>;
  }
}
