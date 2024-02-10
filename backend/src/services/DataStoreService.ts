import { Redis } from "ioredis";
import { DataStore } from "types/DataStore";
import { inject, injectable } from "tsyringe";
import { IDataStoreService } from "types/services/IDataStoreService";

import { Di } from "@enums/Di";

import { composeDataStoreKey } from "@helpers/composeDataStoreKey";

@injectable()
export class DataStoreService implements IDataStoreService {
  constructor(
    @inject(Di.Redis)
    private _redis: Redis
  ) {}

  createHash<T extends Record<keyof T, string>>(
    key: DataStore.Key,
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

  getHashField<T>(key: DataStore.Key, field: keyof T): Promise<string | null> {
    return this._redis.hget(composeDataStoreKey(key), <string>field);
  }

  async updateHashField<T>(
    key: DataStore.Key,
    field: keyof T,
    value: string
  ): Promise<number> {
    return this._redis.hfupdate(composeDataStoreKey(key), <string>field, value);
  }

  async deleteHash(key: DataStore.Key): Promise<number> {
    return this._redis.hdel2(composeDataStoreKey(key));
  }

  async set<T>(
    key: DataStore.Key,
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

  isKeyDefined(key: DataStore.Key): Promise<number> {
    return this._redis.exists(composeDataStoreKey(key));
  }

  async get<T>(key: DataStore.Key): Promise<T | null> {
    const dataKey = composeDataStoreKey(key);

    const value = await this._redis.get(dataKey);

    if (!value) {
      return null;
    }

    return <T>JSON.parse(value);
  }

  ttl(key: DataStore.Key): Promise<number> {
    const dataKey = composeDataStoreKey(key);

    return this._redis.ttl(dataKey);
  }

  delete(key: DataStore.Key): Promise<number> {
    return this._redis.del(composeDataStoreKey(key));
  }

  scan(pattern: string, cursor = 0) {
    return this._redis.scan(cursor, "MATCH", pattern);
  }

  getAllHashes(
    keys: string[]
  ): Promise<[error: Error | null, result: unknown][] | null> {
    const pipeline = this._redis.pipeline();

    for (const key of keys) {
      pipeline.hgetall(key);
    }

    return pipeline.exec();
  }

  async update<T>(
    key: DataStore.Key,
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
