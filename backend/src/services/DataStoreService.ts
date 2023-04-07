import { Redis } from "ioredis";
import { inject, injectable } from "tsyringe";

import { Di } from "@enums/Di";
import { DataStoreKeyType } from "@enums/DataStoreKeyType";
import { IDataStoreService } from "@interfaces/IDataStoreService";
import { composeDataStoreKey } from "@helpers/composeDataStoreKey";

@injectable()
export class DataStoreService implements IDataStoreService {
  constructor(
    @inject(Di.Redis)
    private _redis: Redis
  ) {}

  set<T>(
    key: string | number,
    keyType: DataStoreKeyType,
    value: T,
    options?: { withTTL: { seconds: number } }
  ): Promise<string | null> {
    if (typeof key !== "string") {
      key = key.toString();
    }

    const valueAsString = JSON.stringify(value);

    const dataStoreKey = composeDataStoreKey(key, keyType);

    if (options?.withTTL) {
      return this._redis.set(
        dataStoreKey,
        valueAsString,
        "EX",
        options.withTTL.seconds
      );
    }

    return this._redis.set(dataStoreKey, valueAsString);
  }

  async get<T>(
    key: string | number,
    keyType: DataStoreKeyType
  ): Promise<T | null> {
    if (typeof key !== "string") {
      key = key.toString();
    }

    const dataKey = composeDataStoreKey(key, keyType);

    const value = await this._redis.get(dataKey);

    if (!value) {
      return null;
    }

    return <T>JSON.parse(value);
  }

  delete(key: string | number, keyType: DataStoreKeyType): Promise<number> {
    if (typeof key !== "string") {
      key = key.toString();
    }

    const dataKey = composeDataStoreKey(key, keyType);

    return this._redis.del(dataKey);
  }
}
