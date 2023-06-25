import { injectable } from "tsyringe";
import { Repository, UpdateResult } from "typeorm";

import { BaseRepository } from "./BaseRepository";

import { Bundle } from "@entities/Bundle";
import { BundleExpire } from "@enums/BundleExpire";
import { BundleStatus } from "@enums/BundleStatus";
import { IBundleRepository } from "@interfaces/repositories/IBundleRepository";

@injectable()
export class BundleRepository
  extends BaseRepository<Bundle>
  implements IBundleRepository
{
  protected database: Repository<Bundle>;

  constructor() {
    super(Bundle);
  }

  setStatus(id: number, status: BundleStatus): Promise<UpdateResult> {
    return this.database.update({ id }, { status });
  }

  // @TODO
  setExpiresAt(id: number, expiresAt: BundleExpire): Promise<UpdateResult> {
    throw new Error("Method not implemented.");
  }
}
