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
import { FileStorageMode } from "@enums/FileStorageMode";

@injectable()
export class LocalFileService extends BaseFileService {
  constructor(
    @inject(Di.FileRepository)
    protected fileRepository: IFileRepository
  ) {
    super(fileRepository);
  }

  async moveWorkspaceFilesFromTemporaryDir(arg: {
    files: IFormDataFile[];
    workspaceId: number;
  }): Promise<void> {
    if (FILES.ACTIVE_MODE !== FileStorageMode.Local) {
      return;
    }

    const { files, workspaceId } = arg;

    const { BASE_TEMPORARY_UPLOADS_PATH, BASE_UPLOADS_PATH } = FILES;

    await fs.ensureDir(FILES.BASE_UPLOADS_PATH);

    for (const { file } of files) {
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

  async getContent(arg: {
    variant: Variant;
    from: { workspaceId: number };
  }): Promise<string | null> {
    const {
      variant,
      from: { workspaceId },
    } = arg;

    try {
      const file = await fs.readFile(
        path.join(
          FILES.BASE_UPLOADS_PATH,
          `workspace-${workspaceId}`,
          variant.filename
        )
      );

      return file.toString();
    } catch (error) {
      return null;
    }
  }

  async writeFile(arg: {
    buffer: Buffer;
    filename: string;
    pathToFile: string;
  }): Promise<{ size: number } | null> {
    const { buffer, filename, pathToFile } = arg;

    const fullPath = path.join(pathToFile, filename);

    try {
      await fs.writeFile(fullPath, buffer);

      return { size: Buffer.byteLength(buffer) };
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  handleUpload(arg: {
    files: IFormDataFile[];
    uploadBy: { userId: number };
    uploadTo: { workspaceId: number };
  }): Promise<TransactionResult<File[]>> {
    const {
      files,
      uploadBy: { userId },
      uploadTo: { workspaceId },
    } = arg;

    return this.saveHandler(userId, workspaceId, files, {
      onTry: async () => {
        await this.moveWorkspaceFilesFromTemporaryDir({ files, workspaceId });
      },

      onCatch: async () => {
        await this.removeFromTemporaryDir({ files, from: { workspaceId } });
      },
    });
  }
}
