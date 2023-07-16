import { Result } from "types/Result";
import { injectable } from "tsyringe";
import { QueryRunner, Repository, Like, Not } from "typeorm";

import { FILES } from "@config";

import { BaseRepository } from "./BaseRepository";

import { File } from "@entities/File";
import { Variant } from "@entities/Variant";
import { IFormDataFile } from "@interfaces/IFormDataFile";
import { IFileRepository } from "@interfaces/repositories/IFileRepository";

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
  ): Promise<Result<File[]>> {
    const transaction = await this.useTransaction();

    try {
      const temporaryFilesContainer = [];

      for (const { key, file } of formDataFiles) {
        temporaryFilesContainer.push(
          this._createFileInstance(transaction, {
            userId,
            size: file.size,
            filename: file.newFilename,
            variantName: "v1",
            workspaceId: workspaceId,
            relativePath: key,
            originalFilename: file.originalFilename,
          })
        );
      }

      const files = await transaction.manager.save(
        File,
        temporaryFilesContainer
      );

      await transaction.commitTransaction();

      return Result.success(files);
    } catch (error) {
      console.log(error);

      await transaction.rollbackTransaction();

      return Result.failure();
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
    properties: {
      size: number;
      userId: number;
      filename: string;
      variantName: string;
      workspaceId: number;
      relativePath: string;
      originalFilename: string | null;
    }
  ) {
    const {
      size,
      userId,
      filename,
      variantName,
      workspaceId,
      relativePath,
      originalFilename,
    } = properties;

    const variant = transaction.manager.create(Variant, {
      size,
      filename,
      createdBy: {
        id: userId,
      },
      name: variantName,
    });

    const file = transaction.manager.create(File, {
      originalFilename: originalFilename || "",
      relativePath,
      variants: [variant],
      workspace: {
        id: workspaceId,
      },
    });

    return file;
  }
}
