import type { IBucketDto } from "@shared/types/dtos/Bucket";
import type { BucketContent } from "@shared/types/BucketContent";

export type Bucket = IBucketDto & {
  initialValue: BucketContent;
};
