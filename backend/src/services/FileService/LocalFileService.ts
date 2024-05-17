import path from "path";
import fs from "fs-extra";
import { Response } from "express";
import { File } from "@db/entities/File";
import { Bundle } from "@db/entities/Bundle";
import { inject, injectable } from "tsyringe";
import { Variant } from "@db/entities/Variant";
import { IFormDataFile } from "types/IFormDataFile";
import { TransactionResult } from "types/TransactionResult";
import { IFileRepository } from "types/repositories/IFileRepository";

import { FILES } from "@config";

import { BaseFileService } from "./BaseFileService";

import { Di } from "@enums/Di";
import { FileStorageMode } from "@enums/FileStorageMode";

@injectable()
export class LocalFileService extends BaseFileService {
  constructor(
    @inject(Di.FileRepository)
    protected fileRepository: IFileRepository
  ) {
    super(fileRepository);
  }

  downloadBundle(arg: { bundle: Bundle; response: Response }) {
    const {
      response,
      bundle: { filename },
    } = arg;

    response.download(path.join(FILES.BASE_DOWNLOADS_PATH, filename));
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

  handleUpload(arg: {
    files: IFormDataFile[];
    author: { userId: number };
    target: { workspaceId: number };
  }): Promise<TransactionResult<File[]>> {
    const {
      files,
      author: { userId },
      target: { workspaceId },
    } = arg;

    return this.saveHandler(userId, workspaceId, files, {
      onTry: async () => {
        await this.moveWorkspaceFilesFromTemporaryDir({ files, workspaceId });
      },

      onCatch: async () => {
        // @NOTE we could remove those files but we have job that on each day removes files from TMP dir?
        // await this.removeFromTemporaryDir({ files, from: { workspaceId } });
      },
    });
  }

  async writeFile(arg: {
    buffer: Buffer;
    filename: string;
    pathToFile?: string;
  }): Promise<{ size: number } | null> {
    const { buffer, filename, pathToFile } = arg;

    const fullPath = pathToFile ? path.join(pathToFile, filename) : filename;

    try {
      await fs.writeFile(fullPath, buffer);

      return { size: Buffer.byteLength(buffer) };
    } catch (error) {
      log.error({
        error,
        message: `Failed to save '${fullPath}' file!`,
      });

      return null;
    }
  }

  async deleteFile(arg: {
    filename: string;
    pathToFile?: string;
  }): Promise<void> {
    const { filename, pathToFile } = arg;

    const fullPath = pathToFile ? path.join(pathToFile, filename) : filename;

    try {
      await fs.remove(fullPath);
    } catch (error) {
      log.error({
        error,
        message: `Failed to delete '${fullPath}' file!`,
      });
    }
  }

  async writeVariantFile(arg: {
    filename: string;
    workspaceId: number;
    file: IFormDataFile;
  }): Promise<void> {
    const { workspaceId, file } = arg;

    await this.moveWorkspaceFilesFromTemporaryDir({
      files: [file],
      workspaceId,
    });
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

    for (const file of files) {
      const {
        value: { newFilename },
      } = file;

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
        log.error({
          error,
          message: `Failed to move file from ${src} to ${dest}!`,
        });
      }
    }
  }
}
