import { DataStoreKeyType } from "@enums/DataStoreKeyType";

export interface IDataStoreService {
  createHashFromValue<T extends Record<keyof T, string>>(
    key: [string | number, DataStoreKeyType],
    value: T,
    options?: { withTTL: { seconds: number } }
  ): Promise<[error: Error | null, result: unknown][] | null>;

  getFieldFromHash<T>(
    key: [string | number, DataStoreKeyType],
    field: keyof T
  ): Promise<string | null>;

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
