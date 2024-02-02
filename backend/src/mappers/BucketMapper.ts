import { Bucket } from "@db/entities/Bucket";

import { BaseMapper } from "./BaseMapper";

import { IBucketDTO } from "@shared/types/DTOs/Bucket";
import { BucketContent } from "@shared/types/BucketContent";

export class BucketMapper extends BaseMapper<Bucket> implements IBucketDTO {
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
