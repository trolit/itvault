import type { IBucketDTO } from "@shared/types/dtos/Bucket";
import type { BucketContent } from "@shared/types/BucketContent";

export type Bucket = IBucketDTO & {
  initialValue: BucketContent;
};
