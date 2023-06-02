import formidable from "formidable";
import { injectable } from "tsyringe";
import { QueryRunner, Repository, UpdateResult, Like, Not } from "typeorm";

import { File } from "@entities/File";
import { Variant } from "@entities/Variant";
import { Workspace } from "@entities/Workspace";
import { BaseRepository } from "./BaseRepository";
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

  async store(workspaceId: number, files: formidable.Files): Promise<File[]> {
    const transaction = await this.useTransaction();

    let filesToAdd: File[] = [];

    try {
      const workspace: Workspace = await transaction.manager.findOneByOrFail(
        Workspace,
        { id: workspaceId }
      );

      for (const [key, value] of Object.entries(files)) {
        const values = this.setupFilesToAdd(
          workspace,
          transaction,
          key,
          Array.isArray(value) ? value : [value]
        );

        filesToAdd.push(...values);
      }

      await transaction.manager.save(File, filesToAdd);

      await transaction.commitTransaction();
    } catch (error) {
      await transaction.rollbackTransaction();

      filesToAdd = [];
    } finally {
      await transaction.release();
    }

    return filesToAdd;
  }

  async updateRelativePath(
    workspaceId: number,
    fileId: number,
    relativePath: string
  ): Promise<UpdateResult> {
    return this.database.update(
      {
        id: fileId,
        workspace: {
          id: workspaceId,
        },
      },
      { relativePath }
    );
  }

  getAllByRelativePath(
    workspaceId: number,
    relativePath: string
  ): Promise<File[]> {
    return this.database.find({
      where: {
        relativePath: relativePath === "." ? Not(Like("./%/%")) : relativePath,
        workspace: {
          id: workspaceId,
        },
      },
    });
  }

  private setupFilesToAdd(
    workspace: Workspace,
    transaction: QueryRunner,
    key: string,
    files: formidable.File[]
  ): File[] {
    const result: File[] = [];

    for (const file of files) {
      const variant = transaction.manager.create(Variant, {
        filename: file.newFilename,
        size: file.size,
        name: "v1",
      });

      const fileEntity = transaction.manager.create(File, {
        originalFilename: file.originalFilename || "",
        relativePath: key,
        variants: [variant],
        workspace,
      });

      result.push(fileEntity);
    }

    return result;
  }
}
