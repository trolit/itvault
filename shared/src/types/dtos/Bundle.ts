import { BundleExpire } from "../enums/BundleExpire";
import { BundleStatus } from "../enums/BundleStatus";

export interface IAddBundleDtoValue {
  blueprintId: number;

  variantIds: string[];
}

export interface IAddBundleDto {
  note?: string;

  values: IAddBundleDtoValue[];

  expiration: BundleExpire;
}

export interface IBundleDto {
  id: number;

  filename?: string;

  note: string;

  expire: BundleExpire;

  expiresAt: string;

  status: BundleStatus;

  size: { value: number; unit: string };

  createdBy: {
    id: number;

    fullName: string;
  };

  createdAt: string;
}

export interface IBundleFileDto {
  fileId: number;

  variantId: string;

  name: string;

  version: string;

  isDeleted: boolean;
}
