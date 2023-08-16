import { BaseMapper } from "./BaseMapper";

import { Bucket } from "@entities/Bucket";
import { IBucketDto } from "@shared/types/dtos/IBucketDto";
import { BucketContent } from "@shared/types/BucketContent";

export class BucketMapper extends BaseMapper<Bucket> implements IBucketDto {
  id: number;
  blueprintId: number;
  value: BucketContent;

  constructor(data: Bucket, keys: (keyof Bucket)[] = ["id", "value"]) {
    super(data, keys);

    if (data.blueprint) {
      this.blueprintId = data.blueprint.id;
    }

    return this;
  }
}
