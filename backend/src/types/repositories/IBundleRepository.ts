import { UpdateResult } from "typeorm";

import { Bundle } from "@db/entities/Bundle";
import { IBaseRepository } from "./IBaseRepository";
import { BundleStatus } from "@shared/types/enums/BundleStatus";

export interface IBundleRepository extends IBaseRepository<Bundle> {
  setStatus(id: number, status: BundleStatus): Promise<UpdateResult>;
}
