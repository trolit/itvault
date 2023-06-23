import { Redis } from "ioredis";
import { inject, injectable } from "tsyringe";
import { DataStoreKey } from "data-store-types";

import { Di } from "@enums/Di";
import { IDataStoreService } from "@interfaces/services/IDataStoreService";

import { composeDataStoreKey } from "@helpers/composeDataStoreKey";

@injectable()
export class DataStoreService implements IDataStoreService {
  constructor(
    @inject(Di.Redis)
    private _redis: Redis
  ) {}

  createHash<T extends Record<keyof T, string>>(
    key: DataStoreKey,
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

  getHashField<T>(key: DataStoreKey, field: keyof T): Promise<string | null> {
    return this._redis.hget(composeDataStoreKey(key), <string>field);
  }

  async updateHashField<T>(
    key: DataStoreKey,
    field: keyof T,
    value: string
  ): Promise<number> {
    return this._redis.hfupdate(composeDataStoreKey(key), <string>field, value);
  }

  async deleteHash(key: DataStoreKey): Promise<number> {
    return this._redis.hdel2(composeDataStoreKey(key));
  }

  async set<T>(
    key: DataStoreKey,
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

  async get<T>(key: DataStoreKey): Promise<T | null> {
    const dataKey = composeDataStoreKey(key);

    const value = await this._redis.get(dataKey);

    if (!value) {
      return null;
    }

    return <T>JSON.parse(value);
  }

  ttl(key: DataStoreKey): Promise<number> {
    const dataKey = composeDataStoreKey(key);

    return this._redis.ttl(dataKey);
  }

  delete(key: DataStoreKey): Promise<number> {
    return this._redis.del(composeDataStoreKey(key));
  }

  async update<T>(
    key: DataStoreKey,
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
