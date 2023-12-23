import { BucketContent } from "../BucketContent";

export interface IBucketDto {
  id: number;

  blueprintId: number;

  value: BucketContent;
}

export interface IAddEditBucketDto {
  value: BucketContent;

  blueprintId: number;

  variantId: string;
}
