import { DataStoreKey } from "data-store-types";

export interface IDataStoreService {
  createHash<T extends Record<keyof T, string>>(
    key: DataStoreKey,
    value: T,
    options?: { withTTL: { seconds: number } }
  ): Promise<[error: Error | null, result: unknown][] | null>;

  getHashField<T>(key: DataStoreKey, field: keyof T): Promise<string | null>;

  updateHashField<T>(
    key: DataStoreKey,
    field: keyof T,
    value: string
  ): Promise<number>;

  deleteHash(key: DataStoreKey): Promise<number>;

  set<T>(
    key: DataStoreKey,
    value: T,
    options?: { withTTL: { seconds: number } }
  ): Promise<string | null>;

  get<T>(key: DataStoreKey): Promise<T | null>;

  ttl(key: DataStoreKey): Promise<number>;

  delete(key: DataStoreKey): Promise<number>;

  update<T>(
    key: DataStoreKey,
    callback: (updatedValue: T) => T
  ): Promise<string | null>;
}
