import { BaseMapper } from "./BaseMapper";

import { Variant } from "@entities/Variant";
import { IBundleFileDto } from "@shared/types/dtos/IBundleFileDto";

export class BundleFileMapper
  extends BaseMapper<Variant>
  implements IBundleFileDto
{
  fileId: number;
  variantId: string;
  file: string;
  version: string;
  isDeleted: boolean;

  constructor(data: Variant, keys: (keyof Variant)[] = []) {
    super(data, keys);

    if (data.file) {
      this.fileId = data.file.id;
      this.file = data.file?.originalFilename;
    }

    this.variantId = data.id;
    this.version = data.name;
    this.isDeleted = !!data.deletedAt;

    return this;
  }
}
