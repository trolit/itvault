import { BaseMapper } from "./BaseMapper";

import { Variant } from "@entities/Variant";
import { IBundleFileDto } from "@shared/types/dtos/IBundleFileDto";

export class BundleFileMapper
  extends BaseMapper<Variant>
  implements IBundleFileDto
{
  fileId: number;
  variantId: string;
  name: string;
  version: string;
  isDeleted: boolean;

  constructor(data: Variant) {
    super(data, []);

    if (data.file) {
      this.fileId = data.file.id;
      this.name = data.file?.originalFilename;
    }

    this.variantId = data.id;
    this.version = data.name;
    this.isDeleted = !!data.deletedAt;

    return this;
  }
}
