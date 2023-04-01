export interface IDataStoreService {
  setKey<T>(key: string, value: T): Promise<string | null>;

  getKey(
    key: string
  ): Promise<{ asString: () => string; asParsed: <T>() => T } | null>;
}
