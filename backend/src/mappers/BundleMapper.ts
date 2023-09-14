import { BaseMapper } from "./BaseMapper";

import { Bundle } from "@entities/Bundle";
import { IBundleDto } from "@shared/types/dtos/IBundleDto";
import { BundleStatus } from "@shared/types/enums/BundleStatus";
import { BundleExpire } from "@shared/types/enums/BundleExpire";

export class BundleMapper extends BaseMapper<Bundle> implements IBundleDto {
  id: number;
  filename?: string;
  note: string;
  expire: BundleExpire;
  expiresAt: string;
  status: BundleStatus;
  createdBy: { id: number; fullName: string };
  createdAt: string;
  size: { value: number; unit: string };

  constructor(
    data: Bundle,
    keys: (keyof Bundle)[] = [
      "id",
      "note",
      "filename",
      "expire",
      "expiresAt",
      "status",
      "createdBy",
    ]
  ) {
    super(data, keys);

    this.createdAt = data.createdAt.toISOString();

    this.size = {
      value: data.size,
      unit: "B",
    };

    return this;
  }
}
