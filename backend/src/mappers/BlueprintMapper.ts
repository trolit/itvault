import { BaseMapper } from "./BaseMapper";

import { Blueprint } from "@entities/Blueprint";
import { IBlueprintDto } from "@shared/types/dtos/IBlueprintDto";

export class BlueprintMapper
  extends BaseMapper<Blueprint>
  implements IBlueprintDto
{
  id: number;
  name: string;
  description: string;
  pinnedAt: string | null;
  color: string;
  createdAt: string;
  updatedAt: string;

  constructor(data: Blueprint) {
    super(data, [
      "id",
      "name",
      "description",
      "pinnedAt",
      "color",
      "createdAt",
      "updatedAt",
    ]);

    this.assignInitialKeys();

    return this;
  }
}
