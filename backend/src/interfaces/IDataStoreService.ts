import { DataStoreKeyType } from "@enums/DataStoreKeyType";

export interface IDataStoreService {
  setKey<T>(
    key: string | number,
    keyType: DataStoreKeyType,
    value: T
  ): Promise<string | null>;

  getKey<T>(key: string | number, keyType: DataStoreKeyType): Promise<T | null>;

  updateKey<T>(
    key: string | number,
    keyType: DataStoreKeyType,
    callback: (value: T) => void
  ): Promise<string | null>;

  deleteKey(key: string | number, keyType: DataStoreKeyType): Promise<number>;
}
