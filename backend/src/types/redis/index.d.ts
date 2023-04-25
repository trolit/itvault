// Type definitions for ioredis
import { Redis } from "ioredis";

declare module "ioredis" {
  export interface Redis {
    hfupdate(
      key: string,
      field: string,
      value: string,
      callback?: Callback<string>
    ): Result<number, Context>;
  }
}
