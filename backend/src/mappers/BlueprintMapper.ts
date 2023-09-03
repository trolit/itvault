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
  color: string;
  createdAt: string;
  updatedAt: string;

  constructor(
    data: Blueprint,
    keys: (keyof Blueprint)[] = [
      "id",
      "name",
      "description",
      "color",
      "createdAt",
      "updatedAt",
    ]
  ) {
    super(data, keys);

    return this;
  }
}
