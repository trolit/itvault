export interface IDataStoreService {
  setKey(key: string, value: string): Promise<string | null>;

  getKey(
    key: string
  ): Promise<{ asString: () => string; asParsed: <T>() => T } | null>;
}
