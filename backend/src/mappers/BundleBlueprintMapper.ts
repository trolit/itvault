import { BaseMapper } from "./BaseMapper";

import { Blueprint } from "@entities/Blueprint";
import { IBundleBlueprintDto } from "@shared/types/dtos/IBundleBlueprintDto";

export class BundleBlueprintMapper
  extends BaseMapper<Blueprint>
  implements IBundleBlueprintDto
{
  id: number;
  name: string;
  color: string;
  isDeleted: boolean;

  constructor(data: Blueprint) {
    super(data, ["id", "name", "color"]);

    this.assignInitialKeys();

    this.isDeleted = !!data.deletedAt;

    return this;
  }
}
