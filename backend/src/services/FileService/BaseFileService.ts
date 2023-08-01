import { TransactionResult } from "types/TransactionResult";
import { TransactionError } from "types/custom-errors/TransactionError";

import { File } from "@entities/File";
import { Variant } from "@entities/Variant";
import { IBaseFileService } from "@interfaces/services/IBaseFileService";
import { IFileRepository } from "@interfaces/repositories/IFileRepository";

export abstract class BaseFileService implements IBaseFileService {
  constructor(protected fileRepository: IFileRepository) {}

  async softDeleteFileAndVariants(
    id: number
  ): Promise<TransactionResult<void>> {
    const transaction = await this.fileRepository.useTransaction();

    try {
      const file = await transaction.manager.findOneByOrFail(File, { id });

      // @TODO consider adding to each file name e.g. underscore to mark file as deleted?
      transaction.manager.softDelete(Variant, { file: { id: file.id } });

      await transaction.commitTransaction();

      return TransactionResult.success();
    } catch (error) {
      console.log(error);

      await transaction.rollbackTransaction();

      return TransactionResult.failure(
        error instanceof TransactionError ? error.message : undefined
      );
    } finally {
      await transaction.release();
    }
  }
}
