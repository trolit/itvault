import { Repository } from "typeorm";
import { injectable } from "tsyringe";
import { TransactionResult } from "types/TransactionResult";
import { IBucketRepository } from "types/repositories/IBucketRepository";

import { BaseRepository } from "./BaseRepository";

import { Bucket } from "@entities/Bucket";
import { BucketContent } from "@shared/types/BucketContent";

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
    value: BucketContent,
    blueprintId: number,
    variantId: string
  ): Promise<TransactionResult<Bucket>> {
    const transaction = await this.useTransaction();

    try {
      await transaction.manager.delete(Bucket, {
        variant: { id: variantId },
        blueprint: {
          id: blueprintId,
        },
      });

      const bucket = await transaction.manager.save(Bucket, {
        value,
        blueprint: { id: blueprintId },
        variant: { id: variantId },
      });

      await transaction.commitTransaction();

      return TransactionResult.success(bucket);
    } catch (error) {
      await transaction.rollbackTransaction();

      return TransactionResult.failure();
    } finally {
      await transaction.release();
    }
  }
}
