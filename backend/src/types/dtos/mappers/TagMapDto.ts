import { Tag } from "@entities/Tag";
import { BaseMapDto } from "./BaseMapDto";

export class TagMapDto extends BaseMapDto<Tag> {
  constructor(data: Tag, keys: (keyof Tag)[] = ["id", "value"]) {
    super(data, keys);

    return this;
  }
}
