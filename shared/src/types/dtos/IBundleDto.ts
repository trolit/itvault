import { IBundleFileDto } from "./IBundleFileDto";
import { BundleExpire } from "../enums/BundleExpire";
import { BundleStatus } from "../enums/BundleStatus";
import { IBundleBlueprintDto } from "./IBundleBlueprintDto";

export interface IBundleDto {
  id: number;

  filename?: string;

  note: string;

  expire: BundleExpire;

  expiresAt: string;

  status: BundleStatus;

  size: number;

  createdBy: {
    id: number;

    fullName: string;
  };

  blueprints: IBundleBlueprintDto[];

  files: IBundleFileDto[];
}
