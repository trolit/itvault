import { Tag } from "@entities/Tag";
import { BaseMapDto } from "./BaseMapDto";
import { ITagDto } from "@shared/types/dtos/ITagDto";

export class TagMapDto extends BaseMapDto<Tag> implements ITagDto {
  id: number;
  value: string;

  constructor(data: Tag, keys: (keyof Tag)[] = ["id", "value"]) {
    super(data, keys);

    return this;
  }
}
