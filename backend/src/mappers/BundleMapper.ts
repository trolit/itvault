import { BaseMapper } from "./BaseMapper";

import { Bundle } from "@entities/Bundle";
import { IBundleDto } from "@shared/types/dtos/IBundleDto";
import { BundleStatus } from "@shared/types/enums/BundleStatus";
import { BundleExpire } from "@shared/types/enums/BundleExpire";

export class BundleMapper extends BaseMapper<Bundle> implements IBundleDto {
  id: number;
  filename: string;
  note: string;
  expire: BundleExpire;
  expiresAt: string;
  status: BundleStatus;
  size: number;
  blueprints: { name: string; isDeleted: boolean }[];
  variants: { file: string; version: string; isDeleted: boolean }[];
  createdBy: { fullName: string };

  constructor(
    data: Bundle,
    keys: (keyof Bundle)[] = [
      "id",
      "note",
      "filename",
      "expire",
      "expiresAt",
      "status",
      "size",
      "createdBy",
    ]
  ) {
    super(data, keys);

    if (data.blueprintToBundle) {
      this.blueprints = data.blueprintToBundle.map(({ blueprint }) => ({
        name: blueprint.name,
        isDeleted: !!blueprint.deletedAt,
      }));
    }

    if (data.variantToBundle) {
      this.variants = data.variantToBundle.map(({ variant }) => ({
        file: variant.file ? variant.file.originalFilename : "",
        version: variant.name,
        isDeleted: !!variant.deletedAt,
      }));
    }

    return this;
  }
}
