import path from "path";
import fs from "fs-extra";
import { inject, injectable } from "tsyringe";

import { FILES } from "@config";

import { BaseFileService } from "./BaseFileService";

import { Di } from "@enums/Di";
import { Variant } from "@entities/Variant";
import { IFormDataFile } from "@interfaces/IFormDataFile";
import { IFileRepository } from "@interfaces/repositories/IFileRepository";

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

      const stats = await fs.stat(fullPath);

      return { size: stats.size };
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  async clearTemporaryDir(): Promise<void> {
    const { BASE_TEMPORARY_UPLOADS_PATH } = FILES;

    try {
      const files = await fs.readdir(BASE_TEMPORARY_UPLOADS_PATH);

      for (const source of files) {
        const fullPath = path.join(BASE_TEMPORARY_UPLOADS_PATH, source);

        await fs.remove(fullPath);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
