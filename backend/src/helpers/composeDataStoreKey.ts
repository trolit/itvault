import { DataStoreKeyType } from "@enums/DataStoreKeyType";

export const composeDataStoreKey = (key: string, keyType: DataStoreKeyType) => {
  return `data-store-${keyType}-${key}`;
};
