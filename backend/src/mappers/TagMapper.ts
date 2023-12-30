import { BaseMapper } from "./BaseMapper";

import { Tag } from "@entities/Tag";
import { ITagDTO } from "@shared/types/DTOs/Tag";

export class TagMapper extends BaseMapper<Tag> implements ITagDTO {
  id: number;
  value: string;

  constructor(data: Tag) {
    super(data, ["id", "value"]);

    this.assignInitialKeys();

    return this;
  }
}
