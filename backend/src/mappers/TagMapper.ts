import { BaseMapper } from "./BaseMapper";

import { Tag } from "@entities/Tag";
import { ITagDto } from "@shared/types/dtos/ITagDto";

export class TagMapper extends BaseMapper<Tag> implements ITagDto {
  id: number;
  value: string;

  constructor(data: Tag, keys: (keyof Tag)[] = ["id", "value"]) {
    super(data, keys);

    return this;
  }
}
