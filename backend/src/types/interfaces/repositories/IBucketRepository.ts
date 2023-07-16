import { Result } from "types/Result";
import { Bucket } from "@entities/Bucket";
import { BucketDto } from "@dtos/BucketDto";
import { IBaseRepository } from "./IBaseRepository";

export interface IBucketRepository extends IBaseRepository<Bucket> {
  save(variantId: string, bucketsToAdd: BucketDto[]): Promise<Result<Bucket[]>>;
}
