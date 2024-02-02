import { injectable } from "tsyringe";
import { UpdateResult } from "typeorm";
import { Bundle } from "@db/entities/Bundle";
import { IBundleRepository } from "types/repositories/IBundleRepository";

import { BaseRepository } from "./BaseRepository";

import { BundleStatus } from "@shared/types/enums/BundleStatus";

@injectable()
export class BundleRepository
  extends BaseRepository<Bundle>
  implements IBundleRepository
{
  constructor() {
    super(Bundle);
  }

  setStatus(id: number, status: BundleStatus): Promise<UpdateResult> {
    return this.database.update({ id }, { status });
  }
}
