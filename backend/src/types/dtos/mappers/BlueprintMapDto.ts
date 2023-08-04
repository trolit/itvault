import { BaseMapDto } from "./BaseMapDto";
import { Blueprint } from "@entities/Blueprint";

export class BlueprintMapDto extends BaseMapDto<Blueprint> {
  roleId: number;
  roleName: string;

  constructor(
    data: Blueprint,
    keys: (keyof Blueprint)[] = [
      "id",
      "name",
      "color",
      "createdAt",
      "updatedAt",
    ]
  ) {
    super(data, keys);

    return this;
  }
}
