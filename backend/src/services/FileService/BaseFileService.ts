import uniq from "lodash/uniq";
import { Like, QueryRunner } from "typeorm";
import { IFormDataFile } from "types/IFormDataFile";
import { TransactionResult } from "types/TransactionResult";
import { IBaseFileService } from "types/services/IBaseFileService";
import { IFileRepository } from "types/repositories/IFileRepository";
import { TransactionError } from "types/custom-errors/TransactionError";

import { FILES } from "@config";

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

      for (const file of files) {
        const {
          directory: { relativePath },
        } = file;

        const newRelativePath = relativePath.replace(
          from.relativePath,
          to.relativePath
        );

        let newDirectory = directories.find(
          directory => directory.relativePath === newRelativePath
        );

        if (!newDirectory) {
          const directoryToAdd = await transaction.manager.findOneByOrFail(
            Directory,
            {
              relativePath: newRelativePath,
            }
          );

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

  async handleUpload(
    userId: number,
    workspaceId: number,
    formDataFiles: IFormDataFile[]
  ): Promise<TransactionResult<File[]>> {
    const transaction = await this.fileRepository.useTransaction();

    try {
      const directories = await this._upsertDirectories(
        transaction,
        formDataFiles
      );

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

        const directory = directories.find(
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

  private async _upsertDirectories(
    transaction: QueryRunner,
    formDataFiles: IFormDataFile[]
  ): Promise<Directory[]> {
    const manager = transaction.manager;

    const rootDirectory = await manager.findOneBy(Directory, {
      relativePath: FILES.ROOT,
    });

    if (!rootDirectory) {
      throw new TransactionError("Failed to find root directory!");
    }

    const directories: Directory[] = [];

    const uniqueRelativePaths = uniq(formDataFiles.map(file => file.key));

    for (const relativePath of uniqueRelativePaths) {
      let directory = await manager.findOneBy(Directory, {
        relativePath,
      });

      if (!directory) {
        const splitPath = relativePath.split("/");
        const splitPathLength = splitPath.length;
        let previousDirectory = rootDirectory;

        for (let index = 1; index < splitPathLength; index++) {
          const partOfPath = splitPath.slice(0, index + 1).join("/");

          const record = await manager.findOneBy(Directory, {
            relativePath: partOfPath,
          });

          if (record) {
            record.parentDirectory = previousDirectory;

            await manager.save(Directory, record);

            previousDirectory = record;

            continue;
          }

          const result = await manager.save(Directory, {
            relativePath: partOfPath,
            parentDirectory: previousDirectory,
          });

          previousDirectory = result;
        }

        directory = previousDirectory;
      }

      directories.push(directory);
    }

    return directories;
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
