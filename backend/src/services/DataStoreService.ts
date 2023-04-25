import { Redis } from "ioredis";
import { inject, injectable } from "tsyringe";

import { Di } from "@enums/Di";
import { DataStoreKeyType } from "@enums/DataStoreKeyType";
import { composeDataStoreKey } from "@helpers/composeDataStoreKey";
import { IDataStoreService } from "@interfaces/service/IDataStoreService";

@injectable()
export class DataStoreService implements IDataStoreService {
  constructor(
    @inject(Di.Redis)
    private _redis: Redis
  ) {}

  createHashFromValue<T extends Record<keyof T, string>>(
    key: [string | number, DataStoreKeyType],
    value: T,
    options?: { withTTL: { seconds: number } }
  ): Promise<[error: Error | null, result: unknown][] | null> {
    const pipeline = this._redis.pipeline();

    const dataStoreKey = composeDataStoreKey(key);

    for (const [objectKey, text] of Object.entries(value)) {
      pipeline.hset(dataStoreKey, objectKey, <string>text);
    }

    if (options?.withTTL) {
      pipeline.expire(dataStoreKey, options.withTTL.seconds);
    }

    return pipeline.exec();
  }

  getFieldFromHash<T>(
    key: [string | number, DataStoreKeyType],
    field: keyof T
  ): Promise<string | null> {
    return this._redis.hget(composeDataStoreKey(key), <string>field);
  }

  async updateFieldValueInHash<T>(
    key: [string | number, DataStoreKeyType],
    field: keyof T,
    value: string
  ): Promise<number> {
    const dataStoreKey = composeDataStoreKey(key);

    const isHashFieldAvailable = await this._redis.hexists(
      dataStoreKey,
      <string>field
    );

    if (!isHashFieldAvailable) {
      return 0;
    }

    return this._redis.hset(dataStoreKey, <string>field, value);
  }

  async deleteHash(key: [string | number, DataStoreKeyType]): Promise<number> {
    const dataStoreKey = composeDataStoreKey(key);

    const keys = await this._redis.hkeys(dataStoreKey);

    if (!keys.length) {
      return 0;
    }

    return this._redis.hdel(dataStoreKey, ...keys);
  }

  async set<T>(
    key: [string | number, DataStoreKeyType],
    value: T,
    options?: { withTTL: { seconds: number } }
  ): Promise<string | null> {
    const valueAsString = JSON.stringify(value);

    const dataStoreKey = composeDataStoreKey(key);

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

  async get<T>(key: [string | number, DataStoreKeyType]): Promise<T | null> {
    const dataKey = composeDataStoreKey(key);

    const value = await this._redis.get(dataKey);

    if (!value) {
      return null;
    }

    return <T>JSON.parse(value);
  }

  ttl(key: [string | number, DataStoreKeyType]): Promise<number> {
    const dataKey = composeDataStoreKey(key);

    return this._redis.ttl(dataKey);
  }

  delete(key: [string | number, DataStoreKeyType]): Promise<number> {
    return this._redis.del(composeDataStoreKey(key));
  }

  async update<T>(
    key: [string | number, DataStoreKeyType],
    callback: (updatedValue: T) => T
  ): Promise<string | null> {
    const value = await this.get<T>(key);

    if (!value) {
      return null;
    }

    const updatedValue = callback(value);

    return this.set<T>(key, updatedValue);
  }
}
