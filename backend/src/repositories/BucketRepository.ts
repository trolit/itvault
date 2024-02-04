import { injectable } from "tsyringe";
import { Bucket } from "@db/entities/Bucket";
import { TransactionResult } from "types/TransactionResult";
import { IBucketRepository } from "types/repositories/IBucketRepository";

import { BaseRepository } from "./BaseRepository";

import { BucketContent } from "@shared/types/BucketContent";

@injectable()
export class BucketRepository
  extends BaseRepository<Bucket>
  implements IBucketRepository
{
  constructor() {
    super(Bucket);
  }

  async save(arg: {
    value: BucketContent;
    userId: number;
    blueprintId: number;
    variantId: string;
  }): Promise<TransactionResult<{ bucket: Bucket; isUpdate: boolean }>> {
    const { value, userId, blueprintId, variantId } = arg;

    const transaction = await this.useTransaction();

    try {
      const currentState =
        (await transaction.manager.findOne(Bucket, {
          where: {
            variant: { id: variantId },
            blueprint: {
              id: blueprintId,
            },
          },
          relations: {
            createdBy: true,
          },
        })) || undefined;

      const bucket = await transaction.manager.save(Bucket, {
        ...currentState,
        value,
        blueprint: { id: blueprintId },
        variant: { id: variantId },
        createdBy: currentState ? currentState.createdBy : { id: userId },
        updatedBy: { id: userId },
      });

      await transaction.commitTransaction();

      return TransactionResult.success({ bucket, isUpdate: !!currentState });
    } catch (error) {
      await transaction.rollbackTransaction();

      return TransactionResult.failure();
    } finally {
      await transaction.release();
    }
  }
}
