import { DataStoreKeyType } from "@enums/DataStoreKeyType";

export interface IDataStoreService {
  set<T>(
    key: string | number,
    keyType: DataStoreKeyType,
    value: T,
    options?: { withTTL: { seconds: number } }
  ): Promise<string | null>;

  get<T>(key: string | number, keyType: DataStoreKeyType): Promise<T | null>;

  setKey<T>(
    key: string | number,
    keyType: DataStoreKeyType,
    value: T
  ): Promise<string | null>;

  getKey<T>(key: string | number, keyType: DataStoreKeyType): Promise<T | null>;

  deleteKey(key: string | number, keyType: DataStoreKeyType): Promise<number>;
}
