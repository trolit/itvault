import { BaseMapper } from "./BaseMapper";

import { Variant } from "@entities/Variant";
import { IBundleVariantDto } from "@shared/types/dtos/IBundleVariantDto";

export class BundleVariantMapper
  extends BaseMapper<Variant>
  implements IBundleVariantDto
{
  file: string;
  version: string;
  isDeleted: boolean;

  constructor(data: Variant, keys: (keyof Variant)[] = []) {
    super(data, keys);

    if (data.file) {
      this.file = data.file?.originalFilename;
    }

    this.version = data.name;

    this.isDeleted = !!data.deletedAt;

    return this;
  }
}
