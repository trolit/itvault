import path from "path";
import fs from "fs-extra";
import { inject, injectable } from "tsyringe";
import { IFormDataFile } from "types/IFormDataFile";
import { TransactionResult } from "types/TransactionResult";
import { IFileRepository } from "types/repositories/IFileRepository";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import { FILES } from "@config";

import { BaseFileService } from "./BaseFileService";

import { Di } from "@enums/Di";
import { File } from "@entities/File";
import { Variant } from "@entities/Variant";

@injectable()
export class S3FileService extends BaseFileService {
  constructor(
    @inject(Di.S3Client)
    protected _s3Client: S3Client,
    @inject(Di.FileRepository)
    protected fileRepository: IFileRepository
  ) {
    super(fileRepository);
  }

  async getContent(arg: {
    variant: Variant;
    from: { workspaceId: number };
  }): Promise<string | null> {
    const {
      variant,
      from: { workspaceId },
    } = arg;

    const key = `workspace-${workspaceId}/${variant.filename}`;

    const command = new GetObjectCommand({
      Bucket: FILES.S3.bucket,
      Key: key,
    });

    try {
      const response = await this._s3Client.send(command);

      if (!response || !response.Body) {
        throw Error("Failed to get file!");
      }

      return response.Body.transformToString();
    } catch (err) {
      console.error(err);

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
        for (const { file } of files) {
          if (!file.originalFilename) {
            continue;
          }

          const location = path.join(
            FILES.BASE_TEMPORARY_UPLOADS_PATH,
            `workspace-${workspaceId}`,
            file.newFilename
          );

          const buffer = await fs.readFile(location);

          const result = await this.writeFile({
            buffer,
            filename: file.newFilename,
            pathToFile: `workspace-${workspaceId}`,
          });

          if (!result) {
            throw Error(
              `Failed to write file ${file.newFilename} (${file.originalFilename})`
            );
          }
        }

        await this.removeFromTemporaryDir({ files, from: { workspaceId } });
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
    pathToFile: string;
  }): Promise<{ size: number } | null> {
    const { buffer, filename, pathToFile } = arg;

    const command = new PutObjectCommand({
      Bucket: FILES.S3.bucket,
      Key: `${pathToFile}/${filename}`,
      Body: buffer,
    });

    try {
      await this._s3Client.send(command);

      return { size: Buffer.byteLength(buffer) };
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  async writeVariantFile(arg: {
    filename: string;
    workspaceId: number;
    formDataFile: IFormDataFile;
  }): Promise<void> {
    const { filename, workspaceId } = arg;

    const location = path.join(
      FILES.BASE_TEMPORARY_UPLOADS_PATH,
      `workspace-${workspaceId}`,
      filename
    );

    const buffer = await fs.readFile(location);

    await this.writeFile({
      buffer,
      filename,
      pathToFile: `workspace-${workspaceId}`,
    });
  }
}
