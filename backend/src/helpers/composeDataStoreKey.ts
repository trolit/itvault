import { DataStoreKeyType } from "@enums/DataStoreKeyType";

export const composeDataStoreKey = (
  key: [identifier: string | number, keyType: DataStoreKeyType]
) => {
  const [identifier, keyType] = key;

  const value =
    typeof identifier !== "string" ? identifier.toString() : identifier;

  return `${keyType}-${value}`;
};
