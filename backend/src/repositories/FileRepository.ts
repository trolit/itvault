import { injectable } from "tsyringe";
import { QueryRunner, Repository } from "typeorm";
import { IFormDataFile } from "types/IFormDataFile";
import { TransactionResult } from "types/TransactionResult";
import { IFileRepository } from "types/repositories/IFileRepository";

import { BaseRepository } from "./BaseRepository";

import { File } from "@entities/File";
import { Variant } from "@entities/Variant";

@injectable()
export class FileRepository
  extends BaseRepository<File>
  implements IFileRepository
{
  protected database: Repository<File>;

  constructor() {
    super(File);
  }

  // @TODO should save directories like in DirectorySeeder
  async save(
    userId: number,
    workspaceId: number,
    formDataFiles: IFormDataFile[]
  ): Promise<TransactionResult<File[]>> {
    const transaction = await this.useTransaction();

    try {
      const temporaryFilesContainer = [];

      for (const { key, file } of formDataFiles) {
        if (!file.originalFilename) {
          continue;
        }

        const record = await transaction.manager.findOne(File, {
          where: {
            originalFilename: file.originalFilename,
          },
          relations: {
            variants: true,
            directory: true,
          },
        });

        temporaryFilesContainer.push(
          this._createFileInstance(
            transaction,
            record || {
              originalFilename: file.originalFilename,
            },
            {
              userId,
              workspaceId,
              size: file.size,
              relativePath: key,
              filename: file.newFilename,
            }
          )
        );
      }

      const files = await transaction.manager.save(
        File,
        temporaryFilesContainer,
        {
          chunk: 1000,
        }
      );

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

  getAllByRelativePath(
    workspaceId: number,
    relativePath: string
  ): Promise<File[]> {
    return this.database.find({
      order: {
        originalFilename: "ASC",
      },
      where: {
        directory: {
          relativePath,
        },
        workspace: {
          id: workspaceId,
        },
      },
      relations: {
        directory: true,
      },
    });
  }

  getAllByBlueprintId(workspaceId: number, blueprintId: number) {
    return this.database.find({
      order: {
        originalFilename: "ASC",
      },
      select: {
        id: true,
        originalFilename: true,
        variants: {
          id: true,
          name: true,
        },
        directory: {
          relativePath: true,
        },
      },
      where: {
        workspace: {
          id: workspaceId,
        },
        variants: {
          buckets: {
            blueprint: {
              id: blueprintId,
            },
          },
        },
      },
      relations: {
        variants: true,
        directory: true,
      },
    });
  }

  private _createFileInstance(
    transaction: QueryRunner,
    fileData: Partial<File>,
    additionalData: {
      size: number;
      userId: number;
      filename: string;
      workspaceId: number;
      relativePath: string;
    }
  ) {
    const { size, userId, filename, workspaceId, relativePath } =
      additionalData;

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
    });

    file.directory.relativePath = relativePath;

    return file;
  }
}
