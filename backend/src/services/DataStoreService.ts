import { Redis } from "ioredis";
import { inject, injectable } from "tsyringe";

import { Di } from "@enums/Di";
import { DataStoreKeyType } from "@enums/DataStoreKeyType";
import { JWT_TOKEN_LIFETIME_IN_SECONDS } from "@config/index";
import { IDataStoreService } from "@interfaces/IDataStoreService";

@injectable()
export class DataStoreService implements IDataStoreService {
  constructor(
    @inject(Di.Redis)
    private _redis: Redis
  ) {}

  setKey<T>(
    key: string | number,
    keyType: DataStoreKeyType,
    value: T
  ): Promise<string | null> {
    if (typeof key !== "string") {
      key = key.toString();
    }

    const valueAsString = JSON.stringify(value);

    const dataKey = this.composeDataKey(key, keyType);

    return this._redis.set(
      dataKey,
      valueAsString,
      "EX",
      JWT_TOKEN_LIFETIME_IN_SECONDS
    );
  }

  async getKey<T>(
    key: string | number,
    keyType: DataStoreKeyType
  ): Promise<T | null> {
    if (typeof key !== "string") {
      key = key.toString();
    }

    const dataKey = this.composeDataKey(key, keyType);

    const value = await this._redis.get(dataKey);

    if (!value) {
      return null;
    }

    return <T>JSON.parse(value);
  }

  async updateKey<T>(
    key: string | number,
    keyType: DataStoreKeyType,
    callback: (state: T) => void
  ): Promise<string | null> {
    if (typeof key !== "string") {
      key = key.toString();
    }

    const element = await this.getKey<T>(key, keyType);

    if (!element) {
      return null;
    }

    callback(element);

    const result = await this.setKey<T>(key, keyType, element);

    return result;
  }

  deleteKey(key: string | number, keyType: DataStoreKeyType): Promise<number> {
    if (typeof key !== "string") {
      key = key.toString();
    }

    const dataKey = this.composeDataKey(key, keyType);

    return this._redis.del(dataKey);
  }

  private composeDataKey(key: string, keyType: DataStoreKeyType) {
    return `data-store-${keyType}-${key}`;
  }
}
