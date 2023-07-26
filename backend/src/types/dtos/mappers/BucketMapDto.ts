import { BaseMapDto } from "./BaseMapDto";
import { Bucket } from "@entities/Bucket";

export class BucketMapDto extends BaseMapDto<Bucket> {
  blueprintId: number;

  constructor(data: Bucket, keys: (keyof Bucket)[] = ["id", "value"]) {
    super(data, keys);

    this.blueprintId = data.blueprint.id;

    return this;
  }
}
