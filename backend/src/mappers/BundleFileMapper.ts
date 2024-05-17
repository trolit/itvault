import { Variant } from "@db/entities/Variant";

import { BaseMapper } from "./BaseMapper";

import { IBundleFileDTO } from "@shared/types/DTOs/Bundle";

export class BundleFileMapper
  extends BaseMapper<Variant>
  implements IBundleFileDTO
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
  }
}
