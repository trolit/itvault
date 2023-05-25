import formidable from "formidable";
import { injectable } from "tsyringe";
import { Repository } from "typeorm";

import { File } from "@entities/File";
import { Variant } from "@entities/Variant";
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

  async store(
    file: formidable.File,
    relativePath: string
  ): Promise<File | null> {
    const transaction = await this.useTransaction();

    let result: File | null = null;

    try {
      const variant = transaction.manager.create(Variant, {
        filename: file.newFilename,
        size: file.size,
        name: "v1",
      });

      result = await transaction.manager.save(File, {
        originalFilename: file.originalFilename || "",
        relativePath: relativePath,
        variants: [variant],
      });

      await transaction.commitTransaction();
    } catch (error) {
      await transaction.rollbackTransaction();
    } finally {
      await transaction.release();
    }

    return result;
  }
}
