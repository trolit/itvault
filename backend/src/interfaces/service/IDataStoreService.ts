import { DataStoreKeyType } from "@enums/DataStoreKeyType";

export interface IDataStoreService {
  createHash<T extends Record<keyof T, string>>(
    key: [string | number, DataStoreKeyType],
    value: T,
    options?: { withTTL: { seconds: number } }
  ): Promise<[error: Error | null, result: unknown][] | null>;

  getHashField<T>(
    key: [string | number, DataStoreKeyType],
    field: keyof T
  ): Promise<string | null>;

  updateHashField<T>(
    key: [string | number, DataStoreKeyType],
    field: keyof T,
    value: string
  ): Promise<number>;

  deleteHash(key: [string | number, DataStoreKeyType]): Promise<number>;

  set<T>(
    key: [string | number, DataStoreKeyType],
    value: T,
    options?: { withTTL: { seconds: number } }
  ): Promise<string | null>;

  get<T>(key: [string | number, DataStoreKeyType]): Promise<T | null>;

  ttl(key: [string | number, DataStoreKeyType]): Promise<number>;

  delete(key: [string | number, DataStoreKeyType]): Promise<number>;

  update<T>(
    key: [string | number, DataStoreKeyType],
    callback: (updatedValue: T) => T
  ): Promise<string | null>;
}
