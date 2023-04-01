export interface IDataStoreService {
  setKey<T>(key: string | number, value: T): Promise<string | null>;

  getKey<T>(key: string | number): Promise<T | null>;

  updateKey<T>(
    key: string | number,
    callback: (value: T) => void
  ): Promise<string | null>;
}
