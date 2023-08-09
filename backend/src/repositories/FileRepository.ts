import { injectable } from "tsyringe";
import { IFormDataFile } from "types/IFormDataFile";
import { TransactionResult } from "types/TransactionResult";
import { QueryRunner, Repository, Like, Not } from "typeorm";
import { IFileRepository } from "types/repositories/IFileRepository";

import { FILES } from "@config";

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
          },
        });

        temporaryFilesContainer.push(
          this._createFileInstance(
            transaction,
            record || {
              relativePath: key,
              originalFilename: file.originalFilename,
            },
            {
              userId,
              workspaceId,
              size: file.size,
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

  getOneWithMoreThanTwoVariants(variantIds: string[]): Promise<File | null> {
    return this.database
      .createQueryBuilder("file")
      .leftJoinAndSelect("file.variants", "variant")
      .where("variant.id IN (:...ids)", {
        ids: variantIds,
      })
      .groupBy("variant.id")
      .having("COUNT(variant.id) > 1")
      .getOne();
  }

  getAllByRelativePath(
    workspaceId: number,
    relativePath: string
  ): Promise<File[]> {
    const relativePathQuery =
      relativePath === FILES.ROOT
        ? Not(Like(`${FILES.ROOT}/%/%`))
        : relativePath;

    return this.database.find({
      where: {
        relativePath: relativePathQuery,
        workspace: {
          id: workspaceId,
        },
      },
    });
  }

  getAllByBlueprintId(workspaceId: number, blueprintId: number) {
    return this.database.find({
      select: {
        id: true,
        originalFilename: true,
        variants: {
          id: true,
          name: true,
        },
      },
      where: {
        workspace: {
          id: workspaceId,
          blueprints: {
            id: blueprintId,
          },
        },
      },
      relations: {
        variants: true,
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
    }
  ) {
    const { size, userId, filename, workspaceId } = additionalData;

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

    return file;
  }
}
