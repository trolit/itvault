import { injectable } from "tsyringe";
import { In, Repository } from "typeorm";
import { TransactionResult } from "types/TransactionResult";

import { BaseRepository } from "./BaseRepository";

import { Bucket } from "@entities/Bucket";
import { AddBucketDto } from "@dtos/AddBucketDto";
import { IBucketRepository } from "@interfaces/repositories/IBucketRepository";

@injectable()
export class BucketRepository
  extends BaseRepository<Bucket>
  implements IBucketRepository
{
  protected database: Repository<Bucket>;

  constructor() {
    super(Bucket);
  }

  async save(
    variantId: string,
    bucketsToAdd: AddBucketDto[]
  ): Promise<TransactionResult<Bucket[]>> {
    const transaction = await this.useTransaction();

    try {
      await transaction.manager.delete(Bucket, {
        variant: { id: variantId },
        blueprint: {
          id: In(bucketsToAdd.map(({ blueprintId }) => blueprintId)),
        },
      });

      const buckets = await transaction.manager.save(
        Bucket,
        bucketsToAdd.map(({ value, blueprintId }) => ({
          value,
          blueprint: { id: blueprintId },
          variant: { id: variantId },
        }))
      );

      await transaction.commitTransaction();

      return TransactionResult.success(buckets);
    } catch (error) {
      await transaction.rollbackTransaction();

      return TransactionResult.failure();
    } finally {
      await transaction.release();
    }
  }
}
