import { Bundle } from "@entities/Bundle";
import { BaseMapDto } from "./BaseMapDto";

export class BundleMapDto extends BaseMapDto<Bundle> {
  blueprints: { name: string; isDeleted: boolean }[];

  variants: { file: string; version: string; isDeleted: boolean }[];

  constructor(
    data: Bundle,
    keys: (keyof Bundle)[] = [
      "id",
      "note",
      "expire",
      "expiresAt",
      "status",
      "size",
      "createdBy",
    ]
  ) {
    super(data, keys);

    if (data.blueprintToBundle) {
      this.blueprints = data.blueprintToBundle.map(({ blueprint }) => ({
        name: blueprint.name,
        isDeleted: !!blueprint.deletedAt,
      }));
    }

    if (data.variantToBundle) {
      this.variants = data.variantToBundle.map(({ variant }) => ({
        file: variant.file.originalFilename,
        version: variant.name,
        isDeleted: !!variant.deletedAt,
      }));
    }

    return this;
  }
}
