import { BucketContent } from "../BucketContent";

export interface IBucketDTO {
  id: number;

  blueprintId: number;

  value: BucketContent;
}

export interface IAddEditBucketDTO {
  value: BucketContent;

  blueprintId: number;

  variantId: string;
}
