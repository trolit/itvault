import { Repository } from "typeorm";
import { injectable } from "tsyringe";

import { Variant } from "@entities/Variant";
import { BaseRepository } from "./BaseRepository";
import { IVariantRepository } from "@interfaces/repository/IVariantRepository";

@injectable()
export class VariantRepository
  extends BaseRepository<Variant>
  implements IVariantRepository
{
  protected database: Repository<Variant>;

  constructor() {
    super(Variant);
  }
}
