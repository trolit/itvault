import { inject, injectable } from "tsyringe";
import { Variant } from "@db/entities/Variant";
import { IFormDataFile } from "types/IFormDataFile";
import { IFileService } from "types/services/IFileService";
import { TransactionResult } from "types/TransactionResult";
import { IVariantService } from "types/services/IVariantService";
import { TransactionError } from "types/custom-errors/TransactionError";
import { IVariantRepository } from "types/repositories/IVariantRepository";

import { Di } from "@enums/Di";
import { Dependency } from "@enums/Dependency";

@injectable()
export class VariantService implements IVariantService {
  constructor(
    @inject(Di.VariantRepository)
    private _variantRepository: IVariantRepository,
    @inject(Di.FileService)
    private _fileService: IFileService
  ) {}

  async save(arg: {
    name: string;
    workspaceId: number;
    file: IFormDataFile;
    author: { userId: number };
    variantOf: { fileId: number };
  }): Promise<TransactionResult<Variant>> {
    const {
      name,
      workspaceId,
      file,
      author: { userId },
      variantOf: { fileId },
    } = arg;

    const transaction = await this._variantRepository.useTransaction();

    const { manager } = transaction;

    try {
      const entity = manager.create(Variant, {
        name,
        size: file.value.size,
        filename: file.value.newFilename,
        file: {
          id: fileId,
        },
        createdBy: {
          id: userId,
        },
      });

      const variant = await manager.save(Variant, entity, {
        data: {
          userId,
        },
      });

      await this._fileService.writeVariantFile({
        workspaceId,
        file,
        filename: file.value.newFilename,
      });

      await transaction.commitTransaction();

      return TransactionResult.success(variant);
    } catch (error) {
      log.error({
        error,
        dependency: Dependency.TypeORM,
        message: `Failed to save variant!`,
      });

      await transaction.rollbackTransaction();

      return TransactionResult.failure(
        error instanceof TransactionError ? error.message : undefined
      );
    } finally {
      await transaction.release();
    }
  }
}
