import { BaseMapDto } from "./BaseMapDto";
import { Bucket } from "@entities/Bucket";
import { IBucketDto } from "@shared/types/dtos/IBucketDto";
import { BucketContent } from "@shared/types/BucketContent";

export class BucketMapDto extends BaseMapDto<Bucket> implements IBucketDto {
  id: number;
  blueprintId: number;
  value: BucketContent;

  constructor(data: Bucket, keys: (keyof Bucket)[] = ["id", "value"]) {
    super(data, keys);

    this.blueprintId = data.blueprint.id;

    return this;
  }
}
