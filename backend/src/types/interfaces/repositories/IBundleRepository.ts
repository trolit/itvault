import { UpdateResult } from "typeorm";

import { Bundle } from "@entities/Bundle";
import { BundleExpire } from "@enums/BundleExpire";
import { BundleStatus } from "@enums/BundleStatus";
import { IBaseRepository } from "./IBaseRepository";

export interface IBundleRepository extends IBaseRepository<Bundle> {
  setStatus(id: number, status: BundleStatus): Promise<UpdateResult>;

  setExpiresAt(id: number, expiresAt: BundleExpire): Promise<UpdateResult>;
}
