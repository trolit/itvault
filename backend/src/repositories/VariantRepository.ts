import { injectable } from "tsyringe";
import { Variant } from "@db/entities/Variant";
import { IVariantRepository } from "types/repositories/IVariantRepository";

import { BaseRepository } from "./BaseRepository";

@injectable()
export class VariantRepository
  extends BaseRepository<Variant>
  implements IVariantRepository
{
  constructor() {
    super(Variant);
  }
}
