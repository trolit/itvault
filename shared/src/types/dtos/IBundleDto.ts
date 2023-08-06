import { BundleExpire } from "../enums/BundleExpire";
import { BundleStatus } from "../enums/BundleStatus";

export interface IBundleDto {
  id: number;

  note: string;

  expire: BundleExpire;

  expiresAt: string;

  status: BundleStatus;

  size: number;

  blueprints: { name: string; isDeleted: boolean }[];

  variants: { file: string; version: string; isDeleted: boolean }[];

  createdBy: {
    fullName: string;
  };
}
