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

  async readWorkspaceFile(
    workspaceId: number,
    variant: Variant
  ): Promise<string | null> {
    const key = `${FILES.BASE_UPLOADS_PATH}/workspace-${workspaceId}/${variant.filename}`;

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

  async writeFile(
    filename: string,
    location: string,
    buffer: Buffer
  ): Promise<{ size: number } | null> {
    const fullPath = path.join(location, filename);

    const command = new PutObjectCommand({
      Bucket: FILES.S3.bucket,
      Key: fullPath,
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

  saveFiles(
    userId: number,
    workspaceId: number,
    formDataFiles: IFormDataFile[]
  ): Promise<TransactionResult<File[]>> {
    return this.saveFilesInDatabase(userId, workspaceId, formDataFiles, {
      onTry: async () => {
        for (const { file } of formDataFiles) {
          if (!file.originalFilename) {
            continue;
          }

          const location = path.join(
            FILES.BASE_TEMPORARY_UPLOADS_PATH,
            `workspace-${workspaceId}`
          );

          const buffer = await fs.readFile(`${location}/${file.newFilename}`);

          const result = await this.writeFile(
            file.originalFilename,
            location,
            buffer
          );

          if (!result) {
            throw Error(
              `Failed to write file ${file.newFilename} (${file.originalFilename})`
            );
          }
        }

        await this.clearSpecificFilesFromTemporaryDir(
          workspaceId,
          formDataFiles
        );
      },

      onCatch: async () => {
        await this.clearSpecificFilesFromTemporaryDir(
          workspaceId,
          formDataFiles
        );
      },
    });
  }
}
