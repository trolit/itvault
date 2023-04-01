export interface IDataStoreService {
  setKey<T>(key: string | number, value: T): Promise<string | null>;

  getKey(
    key: string
  ): Promise<{ asString: () => string; asParsed: <T>() => T } | null>;
}
