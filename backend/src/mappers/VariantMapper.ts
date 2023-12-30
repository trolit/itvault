import { BaseMapper } from "./BaseMapper";

import { Variant } from "@entities/Variant";
import { IVariantDTO } from "@shared/types/dtos/Variant";

export class VariantMapper extends BaseMapper<Variant> implements IVariantDTO {
  id: string;
  name: string;
  filename: string;
  createdAt: string;
  size: { value: number; unit: string };

  constructor(data: Variant) {
    super(data, ["id", "name", "filename"]);

    this.assignInitialKeys();

    if (data.createdAt) {
      this.createdAt = data.createdAt.toISOString();
    }

    this.size = {
      value: data.size,
      unit: "B",
    };

    return this;
  }
}
