import path from "path";
import fs from "fs-extra";
import uniq from "lodash/uniq";
import { Response } from "express";
import { File } from "@db/entities/File";
import { Like, QueryRunner } from "typeorm";
import { Bundle } from "@db/entities/Bundle";
import { Variant } from "@db/entities/Variant";
import { Directory } from "@db/entities/Directory";
import { IFormDataFile } from "types/IFormDataFile";
import { TransactionResult } from "types/TransactionResult";
import { IBaseFileService } from "types/services/IBaseFileService";
import { IFileRepository } from "types/repositories/IFileRepository";
import { TransactionError } from "types/custom-errors/TransactionError";

import { FILES } from "@config";

export abstract class BaseFileService implements IBaseFileService {
  constructor(protected fileRepository: IFileRepository) {}

  abstract downloadBundle(arg: {
    bundle: Bundle;
    response: Response;
  }): void | Promise<void>;

  abstract getContent(arg: {
    variant: Variant;
    from: { workspaceId: number };
  }): Promise<string | null>;

  abstract handleUpload(arg: {
    files: IFormDataFile[];
    author: { userId: number };
    target: { workspaceId: number };
  }): Promise<TransactionResult<File[]>>;

  abstract writeFile(arg: {
    buffer: Buffer;
    filename: string;
    pathToFile?: string;
  }): Promise<{ size: number } | null>;

  abstract deleteFile(arg: {
    filename: string;
    pathToFile?: string;
  }): Promise<void>;

  abstract writeVariantFile(arg: {
    filename: string;
    workspaceId: number;
    file: IFormDataFile;
  }): Promise<void>;

  async removeAllFromTemporaryDir(): Promise<void> {
    const { BASE_TEMPORARY_UPLOADS_PATH } = FILES;

    try {
      const files = await fs.readdir(BASE_TEMPORARY_UPLOADS_PATH);

      for (const source of files) {
        const fullPath = path.join(BASE_TEMPORARY_UPLOADS_PATH, source);

        await fs.remove(fullPath);
      }
    } catch (error) {
      log.error({
        error,
        message: `Failed to remove files from ${BASE_TEMPORARY_UPLOADS_PATH}`,
      });
    }
  }

  async removeFromTemporaryDir(arg: {
    files: IFormDataFile[];
    from: { workspaceId: number };
  }): Promise<void> {
    const {
      files,
      from: { workspaceId },
    } = arg;

    const { BASE_TEMPORARY_UPLOADS_PATH } = FILES;

    const basePath = path.join(
      BASE_TEMPORARY_UPLOADS_PATH,
      `workspace-${workspaceId}`
    );

    try {
      for (const file of files) {
        const fullPath = path.join(basePath, file.value.newFilename);

        await fs.remove(fullPath);
      }
    } catch (error) {
      log.error({
        error,
        message: `Failed to remove files from ${basePath}`,
      });
    }
  }

  async moveFromDirToDir(arg: {
    workspaceId: number;
    from: { directoryId: number };
    to: { directoryId: number };
  }): Promise<TransactionResult<void>> {
    const {
      workspaceId,
      from: { directoryId: sourceDirectoryId },
      to: { directoryId: targetDirectoryId },
    } = arg;

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
      log.error({
        error,
        message: `Failed to move files of workspace #${workspaceId} from ${sourceDirectoryId} to ${sourceDirectoryId}`,
      });

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
      log.error({
        error,
        message: `Failed to delete file #${id} and it's variants`,
      });

      await transaction.rollbackTransaction();

      return TransactionResult.failure(
        error instanceof TransactionError ? error.message : undefined
      );
    } finally {
      await transaction.release();
    }
  }

  async saveHandler(
    userId: number,
    workspaceId: number,
    files: IFormDataFile[],
    callbacks: {
      onTry: () => void | Promise<void>;
      onCatch: () => void | Promise<void>;
    }
  ): Promise<TransactionResult<File[]>> {
    const { onTry, onCatch } = callbacks;

    const transaction = await this.fileRepository.useTransaction();

    const uniqueRelativePaths = uniq(files.map(file => file.relativePath));

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

      const fileRecordsToSave = [];

      for (const file of files) {
        const {
          value: { originalFilename: filename },
        } = file;

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
          directory => directory.relativePath === file.relativePath
        );

        if (!directory) {
          throw Error("Failed to resolve directory during files save!");
        }

        fileRecordsToSave.push(
          this._buildFileRecord(
            transaction,
            fileRecord || {
              originalFilename,
            },
            {
              userId,
              directory,
              workspaceId,
              size: file.value.size,
              filename: file.value.newFilename,
            }
          )
        );
      }

      const fileRecords = await transaction.manager.save(
        File,
        fileRecordsToSave,
        {
          chunk: 1000,
          data: {
            userId,
            workspaceId,
          },
        }
      );

      await onTry();

      await transaction.commitTransaction();

      return TransactionResult.success(fileRecords);
    } catch (error) {
      log.error({
        error,
        message: `Failed to handle user #${userId} upload for workspace #${workspaceId}`,
      });

      await onCatch();

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
