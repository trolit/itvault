import { injectable } from "tsyringe";
import { IVariantRepository } from "types/repositories/IVariantRepository";

import { BaseRepository } from "./BaseRepository";

import { Variant } from "@entities/Variant";

@injectable()
export class VariantRepository
  extends BaseRepository<Variant>
  implements IVariantRepository
{
  constructor() {
    super(Variant);
  }
}
