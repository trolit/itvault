import { BaseMapper } from "./BaseMapper";

import { Variant } from "@entities/Variant";
import { IVariantDto } from "@shared/types/dtos/IVariantDto";

export class VariantMapper extends BaseMapper<Variant> implements IVariantDto {
  id: string;
  name: string;
  filename: string;
  createdBy: string;
  size: { value: number; unit: string };

  constructor(
    data: Variant,
    keys: (keyof Variant)[] = ["id", "name", "filename"]
  ) {
    super(data, keys);

    if (data.createdBy) {
      this.createdBy = data.createdBy.fullName;
    }

    this.size = {
      value: data.size,
      unit: "B",
    };

    return this;
  }
}
