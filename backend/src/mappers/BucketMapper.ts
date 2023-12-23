import { BaseMapper } from "./BaseMapper";

import { Bucket } from "@entities/Bucket";
import { IBucketDto } from "@shared/types/dtos/Bucket";
import { BucketContent } from "@shared/types/BucketContent";

export class BucketMapper extends BaseMapper<Bucket> implements IBucketDto {
  id: number;
  blueprintId: number;
  value: BucketContent;

  constructor(data: Bucket) {
    super(data, ["id", "value"]);

    this.assignInitialKeys();

    if (data.blueprint) {
      this.blueprintId = data.blueprint.id;
    }

    return this;
  }
}
