import path from "path";
import fs from "fs-extra";
import { Response } from "express";
import { Readable } from "node:stream";
import { File } from "@db/entities/File";
import { Bundle } from "@db/entities/Bundle";
import { inject, injectable } from "tsyringe";
import { Variant } from "@db/entities/Variant";
import { IFormDataFile } from "types/IFormDataFile";
import { TransactionResult } from "types/TransactionResult";
import { IFileRepository } from "types/repositories/IFileRepository";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import { FILES } from "@config";

import { BaseFileService } from "./BaseFileService";

import { Di } from "@enums/Di";
import { Dependency } from "@enums/Dependency";

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

  async downloadBundle(arg: { bundle: Bundle; response: Response }) {
    const {
      response,
      bundle: { filename },
    } = arg;

    const command = new GetObjectCommand({
      Bucket: FILES.S3.bucket,
      Key: filename,
    });

    try {
      const result = await this._s3Client.send(command);

      if (!result || !result.Body) {
        throw Error("Failed to get file!");
      }

      (result.Body as Readable).pipe(response);
    } catch (error) {
      log.error({
        error,
        dependency: Dependency.TypeORM,
        message: `Failed to get bundle '${filename}' from bucket!`,
      });
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

    const key = `workspace-${workspaceId}/${variant.filename}`;

    const command = new GetObjectCommand({
      Bucket: FILES.S3.bucket,
      Key: key,
    });

    try {
      const response = await this._s3Client.send(command);

      if (!response?.Body) {
        throw new Error("Failed to get file!");
      }

      return response.Body.transformToString();
    } catch (error) {
      log.error({
        error,
        message: `Failed to get content of variant #${variant.id}`,
      });

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
        for (const file of files) {
          const {
            value: { originalFilename, newFilename },
          } = file;

          if (!originalFilename) {
            continue;
          }

          const location = path.join(
            FILES.BASE_TEMPORARY_UPLOADS_PATH,
            `workspace-${workspaceId}`,
            newFilename
          );

          const buffer = await fs.readFile(location);

          const result = await this.writeFile({
            buffer,
            filename: newFilename,
            pathToFile: `workspace-${workspaceId}`,
          });

          if (!result) {
            throw Error(
              `Failed to write file ${newFilename} (${originalFilename})`
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
    pathToFile?: string;
  }): Promise<{ size: number } | null> {
    const { buffer, filename, pathToFile } = arg;

    const key = pathToFile ? `${pathToFile}/${filename}` : filename;

    const command = new PutObjectCommand({
      Bucket: FILES.S3.bucket,
      Key: key,
      Body: buffer,
    });

    try {
      await this._s3Client.send(command);

      return { size: Buffer.byteLength(buffer) };
    } catch (error) {
      log.error({
        error,
        message: `Failed to remove file ${key}`,
      });

      return null;
    }
  }

  async deleteFile(arg: {
    filename: string;
    pathToFile?: string | undefined;
  }): Promise<void> {
    const { filename, pathToFile } = arg;

    const key = pathToFile ? `${pathToFile}/${filename}` : filename;

    const command = new DeleteObjectCommand({
      Bucket: FILES.S3.bucket,
      Key: key,
    });

    try {
      await this._s3Client.send(command);
    } catch (error) {
      log.error({
        error,
        message: `Failed to remove file ${key}`,
      });
    }
  }

  async writeVariantFile(arg: {
    filename: string;
    workspaceId: number;
    file: IFormDataFile;
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
