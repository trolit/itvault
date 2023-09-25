import { BucketContent } from "../BucketContent";

export type AddEditBucketDto = {
  value: BucketContent;

  blueprintId: number;

  variantId: string;
};
