import { DataStoreKeyType } from "@enums/DataStoreKeyType";

export const composeDataStoreKey = (
  key: string | number,
  keyType: DataStoreKeyType
) => {
  if (typeof key !== "string") {
    key = key.toString();
  }

  return `data-store-${keyType}-${key}`;
};
