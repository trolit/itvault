import { Result } from "types/Result";
import { injectable } from "tsyringe";
import { In, Repository } from "typeorm";

import { BaseRepository } from "./BaseRepository";

import { Bucket } from "@entities/Bucket";
import { BucketDto } from "@dtos/BucketDto";
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
    bucketsToAdd: BucketDto[]
  ): Promise<Result<Bucket[]>> {
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

      return Result.success(buckets);
    } catch (error) {
      await transaction.rollbackTransaction();

      return Result.failure();
    } finally {
      await transaction.release();
    }
  }
}
