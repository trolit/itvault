import { Bucket } from "@db/entities/Bucket";
import { IBaseRepository } from "./IBaseRepository";
import { TransactionResult } from "types/TransactionResult";
import { BucketContent } from "@shared/types/BucketContent";

export interface IBucketRepository extends IBaseRepository<Bucket> {
  save(
    value: BucketContent,
    blueprintId: number,
    variantId: string
  ): Promise<TransactionResult<{ bucket: Bucket; isUpdate: boolean }>>;
}
