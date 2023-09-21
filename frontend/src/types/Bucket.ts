import type { IBucketDto } from "@shared/types/dtos/IBucketDto";
import type { BucketContent } from "@shared/types/BucketContent";

export type Bucket = IBucketDto & {
  initialValue: BucketContent;
};
