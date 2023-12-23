import { BundleExpire } from "../enums/BundleExpire";

export interface IAddBundleDtoValue {
  blueprintId: number;

  variantIds: string[];
}

export interface IAddBundleDto {
  note?: string;

  values: IAddBundleDtoValue[];

  expiration: BundleExpire;
}
