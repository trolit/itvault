import { inject, injectable } from "tsyringe";
import { IFormDataFile } from "types/IFormDataFile";
import { IFileService } from "types/services/IFileService";
import { TransactionResult } from "types/TransactionResult";
import { IVariantService } from "types/services/IVariantService";
import { TransactionError } from "types/custom-errors/TransactionError";
import { IVariantRepository } from "types/repositories/IVariantRepository";

import { Di } from "@enums/Di";
import { Variant } from "@entities/Variant";

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
    formDataFile: IFormDataFile;
    author: { userId: number };
    variantOf: { fileId: number };
  }): Promise<TransactionResult<Variant>> {
    const {
      name,
      workspaceId,
      formDataFile,
      author: { userId },
      variantOf: { fileId },
    } = arg;

    const { file } = formDataFile;

    const transaction = await this._variantRepository.useTransaction();

    const { manager } = transaction;

    try {
      const entity = manager.create(Variant, {
        name,
        size: file.size,
        filename: file.newFilename,
        file: {
          id: fileId,
        },
        createdBy: {
          id: userId,
        },
      });

      const variant = await manager.save(Variant, entity);

      await this._fileService.writeVariantFile({
        workspaceId,
        formDataFile,
        filename: file.newFilename,
      });

      await transaction.commitTransaction();

      return TransactionResult.success(variant);
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
