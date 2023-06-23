import { Repository } from "typeorm";
import { injectable } from "tsyringe";

import { BaseRepository } from "./BaseRepository";

import { Bundle } from "@entities/Bundle";
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
}
