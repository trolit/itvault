import type { Bundle } from "@db/entities/Bundle";

import { BaseMapper } from "./BaseMapper";

import type { IBundleDTO } from "@shared/types/DTOs/Bundle";
import type { BundleExpire } from "@shared/types/enums/BundleExpire";
import type { BundleStatus } from "@shared/types/enums/BundleStatus";

export class BundleMapper extends BaseMapper<Bundle> implements IBundleDTO {
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
  }
}
