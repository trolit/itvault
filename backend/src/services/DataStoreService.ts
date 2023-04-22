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
    id: [string | number, DataStoreKeyType],
    value: T,
    options?: { withTTL: { seconds: number } }
  ): Promise<[error: Error | null, result: unknown][] | null> {
    const pipeline = this._redis.pipeline();

    const [key, type] = id;

    const dataStoreKey = composeDataStoreKey(key, type);

    for (const [objectKey, text] of Object.entries(value)) {
      pipeline.hset(dataStoreKey, objectKey, <string>text);
    }

    if (options?.withTTL) {
      pipeline.expire(dataStoreKey, options.withTTL.seconds);
    }

    return pipeline.exec();
  }

  getFieldFromHash<T>(
    id: [string | number, DataStoreKeyType],
    field: keyof T
  ): Promise<string | null> {
    const [key, type] = id;

    return this._redis.hget(composeDataStoreKey(key, type), <string>field);
  }

  async set<T>(
    key: string | number,
    keyType: DataStoreKeyType,
    value: T,
    options?: { withTTL: { seconds: number } }
  ): Promise<string | null> {
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
    const dataKey = composeDataStoreKey(key, keyType);

    const value = await this._redis.get(dataKey);

    if (!value) {
      return null;
    }

    return <T>JSON.parse(value);
  }

  ttl(key: string | number, keyType: DataStoreKeyType): Promise<number> {
    const dataKey = composeDataStoreKey(key, keyType);

    return this._redis.ttl(dataKey);
  }

  async update<T>(
    key: string | number,
    keyType: DataStoreKeyType,
    callback: (updatedValue: T) => T
  ): Promise<string | null> {
    const value = await this.get<T>(key, keyType);

    if (!value) {
      return null;
    }

    const updatedValue = callback(value);

    return this.set<T>(key, keyType, updatedValue);
  }

  delete(
    key: string | number | string[],
    keyType: DataStoreKeyType
  ): Promise<number> {
    if (Array.isArray(key)) {
      const dataKeys = key.map(key => composeDataStoreKey(key, keyType));

      return this._redis.del(dataKeys);
    }

    return this._redis.del(composeDataStoreKey(key, keyType));
  }
}
