import { BundleExpire } from "../enums/BundleExpire";
import { BundleStatus } from "../enums/BundleStatus";

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
