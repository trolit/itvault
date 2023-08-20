import { BundleExpire } from "../enums/BundleExpire";

export type Value = {
  blueprintId: number;

  variantIds: string[];
};

export type AddBundleDto = {
  note?: string;

  values: Value[];

  expiration: BundleExpire;
};
