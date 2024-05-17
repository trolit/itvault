import { Blueprint } from "@db/entities/Blueprint";

import { BaseMapper } from "./BaseMapper";

import { IBlueprintDTO } from "@shared/types/DTOs/Blueprint";

export class BlueprintMapper
  extends BaseMapper<Blueprint>
  implements IBlueprintDTO
{
  id: number;
  name: string;
  description: string;
  pinnedAt: string | null;
  color: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;

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

    this.isDeleted = !!data.deletedAt;
  }
}
