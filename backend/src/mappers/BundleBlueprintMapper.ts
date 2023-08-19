import { BaseMapper } from "./BaseMapper";

import { Blueprint } from "@entities/Blueprint";
import { IBundleBlueprintDto } from "@shared/types/dtos/IBundleBlueprintDto";

export class BundleBlueprintMapper
  extends BaseMapper<Blueprint>
  implements IBundleBlueprintDto
{
  name: string;
  color: string;
  isDeleted: boolean;

  constructor(
    data: Blueprint,
    keys: (keyof Blueprint)[] = ["id", "name", "color"]
  ) {
    super(data, keys);

    this.isDeleted = !!data.deletedAt;

    return this;
  }
}
