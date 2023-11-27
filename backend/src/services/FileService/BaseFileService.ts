import uniq from "lodash/uniq";
import { Like, QueryRunner } from "typeorm";
import { IFormDataFile } from "types/IFormDataFile";
import { TransactionResult } from "types/TransactionResult";
import { IBaseFileService } from "types/services/IBaseFileService";
import { IFileRepository } from "types/repositories/IFileRepository";
import { TransactionError } from "types/custom-errors/TransactionError";

import { File } from "@entities/File";
import { Variant } from "@entities/Variant";
import { Directory } from "@entities/Directory";

export abstract class BaseFileService implements IBaseFileService {
  constructor(protected fileRepository: IFileRepository) {}

  async moveFilesFromDirToDir(
    workspaceId: number,
    sourceDirectoryId: number,
    targetDirectoryId: number
  ): Promise<TransactionResult<void>> {
    const transaction = await this.fileRepository.useTransaction();

    try {
      const from = await transaction.manager.findOneByOrFail(Directory, {
        id: sourceDirectoryId,
      });

      const to = await transaction.manager.findOneByOrFail(Directory, {
        id: targetDirectoryId,
      });

      const files = await transaction.manager.find(File, {
        where: {
          workspace: { id: workspaceId },
          directory: {
            relativePath: Like(`${from.relativePath}%`),
          },
        },
        relations: {
          directory: true,
        },
      });

      const directories: Directory[] = [];

      const leaf = from.relativePath.split("/").pop() || ".";

      for (const file of files) {
        const {
          directory: { relativePath },
        } = file;

        const newRelativePath = relativePath.replace(
          from.relativePath,
          `${to.relativePath}/${leaf}`
        );

        let newDirectory = directories.find(
          directory => directory.relativePath === newRelativePath
        );

        if (!newDirectory) {
          let directoryToAdd = await transaction.manager.findOneBy(Directory, {
            relativePath: newRelativePath,
          });

          if (!directoryToAdd) {
            directoryToAdd = await transaction.manager.save(Directory, {
              relativePath: newRelativePath,
            });
          }

          newDirectory = directoryToAdd;

          directories.push({ ...directoryToAdd });
        }

        file.directory = newDirectory;
      }

      await transaction.manager.save(files);

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

  async softDeleteFileAndVariants(
    id: number
  ): Promise<TransactionResult<void>> {
    const transaction = await this.fileRepository.useTransaction();

    // @NOTE to consider: (1) keep as service action OR (2) move to subscriber
    // @NOTE to consider: (1) soft delete both, (2) soft delete file only

    try {
      const file = await transaction.manager.findOneByOrFail(File, { id });

      // @TODO consider adding to each file name e.g. underscore to mark file as deleted?
      await transaction.manager.softDelete(Variant, { file: { id: file.id } });

      await transaction.manager.softDelete(File, { id });

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

  async handleUpload(
    userId: number,
    workspaceId: number,
    formDataFiles: IFormDataFile[]
  ): Promise<TransactionResult<File[]>> {
    const transaction = await this.fileRepository.useTransaction();

    const uniqueRelativePaths = uniq(formDataFiles.map(file => file.key));

    const dirs: Directory[] = [];

    try {
      for (const relativePath of uniqueRelativePaths) {
        let directory = await transaction.manager.findOneBy(Directory, {
          relativePath,
        });

        if (!directory) {
          directory = await transaction.manager.save(
            transaction.manager.create(Directory, { relativePath })
          );
        }

        dirs.push({ ...directory });
      }

      const filesToSave = [];

      for (const { key, file } of formDataFiles) {
        const { originalFilename: filename } = file;

        if (!filename) {
          continue;
        }

        const originalFilename = filename.includes("/")
          ? filename.split("/").pop()
          : filename;

        if (!originalFilename) {
          continue;
        }

        const fileRecord = await transaction.manager.findOne(File, {
          where: {
            originalFilename,
            workspace: {
              id: workspaceId,
            },
          },
          relations: {
            variants: true,
            directory: true,
          },
        });

        const directory = dirs.find(
          directory => directory.relativePath === key
        );

        if (!directory) {
          continue;
        }

        filesToSave.push(
          this._buildFileRecord(
            transaction,
            fileRecord || {
              originalFilename,
            },
            {
              userId,
              directory,
              workspaceId,
              size: file.size,
              filename: file.newFilename,
            }
          )
        );
      }

      const files = await transaction.manager.save(File, filesToSave, {
        chunk: 1000,
      });

      await transaction.commitTransaction();

      return TransactionResult.success(files);
    } catch (error) {
      console.log(error);

      await transaction.rollbackTransaction();

      return TransactionResult.failure();
    } finally {
      await transaction.release();
    }
  }

  private _buildFileRecord(
    transaction: QueryRunner,
    fileData: Partial<File>,
    additionalData: {
      size: number;
      userId: number;
      filename: string;
      workspaceId: number;
      directory: Directory;
    }
  ) {
    const { size, userId, filename, workspaceId, directory } = additionalData;

    const variantName = fileData?.variants
      ? `v${fileData.variants.length + 1}`
      : "v1";

    const variant = transaction.manager.create(Variant, {
      size,
      filename,
      createdBy: {
        id: userId,
      },
      name: variantName,
    });

    let variants: Variant[] = [variant];

    if (fileData?.id && fileData?.variants) {
      variants = fileData.variants.concat([variant]);
    }

    const file = transaction.manager.create(File, {
      ...fileData,
      variants,
      workspace: {
        id: workspaceId,
      },
      directory,
    });

    return file;
  }
}
