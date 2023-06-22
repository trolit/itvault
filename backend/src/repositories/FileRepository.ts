import { injectable } from "tsyringe";
import { QueryRunner, Repository, Like, Not } from "typeorm";

import { FILES } from "@config";
import { File } from "@entities/File";
import { Variant } from "@entities/Variant";
import { BaseRepository } from "./BaseRepository";
import { IFormDataFile } from "@interfaces/IFormDataFile";
import { IFileRepository } from "@interfaces/repository/IFileRepository";

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
    workspaceId: number,
    formDataFiles: IFormDataFile[]
  ): Promise<File[] | null> {
    const transaction = await this.useTransaction();

    let files: File[] | null = null;

    try {
      const temporaryFilesContainer = [];

      for (const { key, file } of formDataFiles) {
        temporaryFilesContainer.push(
          this.createFileInstance(transaction, {
            size: file.size,
            filename: file.newFilename,
            variantName: "v1",
            workspaceId: workspaceId,
            relativePath: key,
            originalFilename: file.originalFilename,
          })
        );
      }

      files = await transaction.manager.save(File, temporaryFilesContainer);

      await transaction.commitTransaction();
    } catch (error) {
      await transaction.rollbackTransaction();
    } finally {
      await transaction.release();
    }

    return files;
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

  private createFileInstance(
    transaction: QueryRunner,
    properties: {
      size: number;
      filename: string;
      variantName: string;
      workspaceId: number;
      relativePath: string;
      originalFilename: string | null;
    }
  ) {
    const {
      size,
      filename,
      variantName,
      workspaceId,
      relativePath,
      originalFilename,
    } = properties;

    const variant = transaction.manager.create(Variant, {
      size,
      filename,
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
