import { DataStoreKey } from "data-store";

export const composeDataStoreKey = (key: DataStoreKey) => {
  const [identifier, keyType] = key;

  const value =
    typeof identifier !== "string" ? identifier.toString() : identifier;

  return `${keyType}-${value}`;
};
