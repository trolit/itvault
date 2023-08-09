import { Bucket } from "@entities/Bucket";
import { IBaseRepository } from "./IBaseRepository";
import { TransactionResult } from "types/TransactionResult";
import { AddBucketDto } from "@shared/types/dtos/AddBucketDto";

export interface IBucketRepository extends IBaseRepository<Bucket> {
  save(
    variantId: string,
    bucketsToAdd: AddBucketDto[]
  ): Promise<TransactionResult<Bucket[]>>;
}
