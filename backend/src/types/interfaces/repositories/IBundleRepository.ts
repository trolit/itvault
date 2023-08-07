import { UpdateResult } from "typeorm";

import { Bundle } from "@entities/Bundle";
import { BundleStatus } from "@enums/BundleStatus";
import { IBaseRepository } from "./IBaseRepository";

export interface IBundleRepository extends IBaseRepository<Bundle> {
  setStatus(id: number, status: BundleStatus): Promise<UpdateResult>;
}
