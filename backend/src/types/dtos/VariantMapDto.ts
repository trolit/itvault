import { BaseMapDto } from "./BaseMapDto";
import { Variant } from "@entities/Variant";

export class VariantMapDto extends BaseMapDto<Variant> {
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
