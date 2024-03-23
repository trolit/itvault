import type { IBucketDTO } from "@shared/types/DTOs/Bucket";
import type { BucketContent } from "@shared/types/BucketContent";

export type Bucket = IBucketDTO & {
  initialValue: BucketContent;
};
