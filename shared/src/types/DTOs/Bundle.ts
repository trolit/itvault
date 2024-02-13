import { BundleExpire } from "../enums/BundleExpire";
import { BundleStatus } from "../enums/BundleStatus";

export interface IBundleDTO {
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

export interface IBundleFileDTO {
  fileId: number;

  variantId: string;

  name: string;

  version: string;

  isDeleted: boolean;
}

export interface IAddBundleValueDTO {
  blueprintId: number;

  variantIds: string[];
}

export interface IPatchBundleNoteDTO {
  text: string;
}

export interface IAddBundleDTO {
  note?: string;

  values: IAddBundleValueDTO[];

  expiration: BundleExpire;
}
