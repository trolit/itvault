import { Bucket } from "@entities/Bucket";
import { AddBucketDto } from "@dtos/AddBucketDto";
import { IBaseRepository } from "./IBaseRepository";
import { TransactionResult } from "types/TransactionResult";

export interface IBucketRepository extends IBaseRepository<Bucket> {
  save(
    variantId: string,
    bucketsToAdd: AddBucketDto[]
  ): Promise<TransactionResult<Bucket[]>>;
}
