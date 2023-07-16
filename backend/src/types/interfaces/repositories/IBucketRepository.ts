import { Bucket } from "@entities/Bucket";
import { BucketDto } from "@dtos/BucketDto";
import { IBaseRepository } from "./IBaseRepository";
import { TransactionResult } from "types/TransactionResult";

export interface IBucketRepository extends IBaseRepository<Bucket> {
  save(
    variantId: string,
    bucketsToAdd: BucketDto[]
  ): Promise<TransactionResult<Bucket[]>>;
}
