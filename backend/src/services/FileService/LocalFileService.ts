import path from "path";
import fs from "fs-extra";
import { inject, injectable } from "tsyringe";
import { IFormDataFile } from "types/IFormDataFile";
import { TransactionResult } from "types/TransactionResult";
import { IFileRepository } from "types/repositories/IFileRepository";

import { FILES } from "@config";

import { BaseFileService } from "./BaseFileService";

import { Di } from "@enums/Di";
import { File } from "@entities/File";
import { Variant } from "@entities/Variant";

@injectable()
export class LocalFileService extends BaseFileService {
  constructor(
    @inject(Di.FileRepository)
    protected fileRepository: IFileRepository
  ) {
    super(fileRepository);
  }

  async moveFilesFromTemporaryDir(
    workspaceId: number,
    formDataFiles: IFormDataFile[]
  ): Promise<void> {
    const { BASE_TEMPORARY_UPLOADS_PATH, BASE_UPLOADS_PATH } = FILES;

    await fs.ensureDir(FILES.BASE_UPLOADS_PATH);

    for (const { file } of formDataFiles) {
      const { newFilename } = file;

      const src = path.join(
        BASE_TEMPORARY_UPLOADS_PATH,
        `workspace-${workspaceId}`,
        newFilename
      );

      const dest = path.join(
        BASE_UPLOADS_PATH,
        `workspace-${workspaceId}`,
        newFilename
      );

      try {
        await fs.move(src, dest);
      } catch (error) {
        console.error(error);
      }
    }
  }

  async readFile(workspaceId: number, variant: Variant): Promise<string> {
    const file = await fs.readFile(
      path.join(
        FILES.BASE_UPLOADS_PATH,
        `workspace-${workspaceId}`,
        variant.filename
      )
    );

    return file.toString();
  }

  async writeFile(
    filename: string,
    location: string,
    buffer: Buffer
  ): Promise<{ size: number } | null> {
    const fullPath = path.join(location, filename);

    try {
      await fs.writeFile(fullPath, buffer);

      return { size: Buffer.byteLength(buffer) };
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  saveFiles(
    userId: number,
    workspaceId: number,
    formDataFiles: IFormDataFile[]
  ): Promise<TransactionResult<File[]>> {
    return this.saveFilesInDatabase(userId, workspaceId, formDataFiles, {
      onTry: () => {
        this.moveFilesFromTemporaryDir(workspaceId, formDataFiles);
      },
      onCatch: () => {
        // @TODO remove files from temporary dir
      },
    });
  }
}
