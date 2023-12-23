import { BaseMapper } from "./BaseMapper";

import type { Bundle } from "@entities/Bundle";
import type { IBundleDto } from "@shared/types/dtos/Bundle";
import type { BundleStatus } from "@shared/types/enums/BundleStatus";
import type { BundleExpire } from "@shared/types/enums/BundleExpire";

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

  constructor(data: Bundle) {
    super(data, [
      "id",
      "note",
      "filename",
      "expire",
      "expiresAt",
      "status",
      "createdBy",
    ]);

    this.assignInitialKeys();

    this.createdAt = data.createdAt.toISOString();

    this.size = {
      value: data.size,
      unit: "B",
    };

    return this;
  }
}
