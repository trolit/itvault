import { BucketContent } from "../BucketContent";

export interface IBucketDto {
  id: number;

  blueprintId: number;

  value: BucketContent;
}
