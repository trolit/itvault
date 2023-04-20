import { DataStoreKeyType } from "@enums/DataStoreKeyType";

export interface IDataStoreService {
  set<T>(
    key: string | number,
    keyType: DataStoreKeyType,
    value: T,
    options?: { withTTL: { seconds: number } }
  ): Promise<string | null>;

  get<T>(key: string | number, keyType: DataStoreKeyType): Promise<T | null>;

  ttl(key: string | number, keyType: DataStoreKeyType): Promise<number>;

  delete(
    key: string | number | string[],
    keyType: DataStoreKeyType
  ): Promise<number>;

  update<T>(
    key: string | number,
    keyType: DataStoreKeyType,
    callback: (updatedValue: T) => T
  ): Promise<string | null>;
}
