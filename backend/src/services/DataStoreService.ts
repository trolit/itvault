import { Redis } from "ioredis";
import { inject, injectable } from "tsyringe";

import { Di } from "@enums/Di";
import { IDataStoreService } from "@interfaces/IDataStoreService";
import { JWT_TOKEN_LIFETIME_IN_SECONDS } from "@config/index";

@injectable()
export class DataStoreService implements IDataStoreService {
  constructor(
    @inject(Di.Redis)
    private _redis: Redis
  ) {}

  setKey<T>(key: string | number, value: T): Promise<string | null> {
    if (typeof key !== "string") {
      key = key.toString();
    }

    const valueAsString = JSON.stringify(value);

    return this._redis.set(
      key,
      valueAsString,
      "EX",
      JWT_TOKEN_LIFETIME_IN_SECONDS
    );
  }

  async getKey<T>(key: string | number): Promise<T | null> {
    if (typeof key !== "string") {
      key = key.toString();
    }

    const value = await this._redis.get(key);

    if (!value) {
      return null;
    }

    return <T>JSON.parse(value);
  }

  async updateKeyIfPossible<T>(
    key: string | number,
    callback: (value: T) => void
  ): Promise<string | null> {
    if (typeof key !== "string") {
      key = key.toString();
    }

    const element = await this.getKey<T>(key);

    if (!element) {
      return null;
    }

    callback(element);

    const result = await this.setKey<T>(key, element);

    return result;
  }
}
