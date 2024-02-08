import { DataStore } from "types/DataStore";

export interface IDataStoreService {
  createHash<T extends Record<keyof T, string>>(
    key: DataStore.Key,
    value: T,
    options?: { withTTL: { seconds: number } }
  ): Promise<[error: Error | null, result: unknown][] | null>;

  getHashField<T>(key: DataStore.Key, field: keyof T): Promise<string | null>;

  updateHashField<T>(
    key: DataStore.Key,
    field: keyof T,
    value: string
  ): Promise<number>;

  deleteHash(key: DataStore.Key): Promise<number>;

  set<T>(
    key: DataStore.Key,
    value: T,
    options?: { withTTL: { seconds: number } }
  ): Promise<string | null>;

  get<T>(key: DataStore.Key): Promise<T | null>;

  ttl(key: DataStore.Key): Promise<number>;

  delete(key: DataStore.Key): Promise<number>;

  scan(
    pattern: string,
    cursor?: number
  ): Promise<[cursor: string, elements: string[]]>;

  getAllHashes(
    keys: string[]
  ): Promise<[error: Error | null, result: unknown][] | null>;

  update<T>(
    key: DataStore.Key,
    callback: (updatedValue: T) => T
  ): Promise<string | null>;
}
