import { Response } from "express";

import { GetObjectCommandOutput, S3 } from "@aws-sdk/client-s3";
import { File } from "@db/entities/File";
import { Variant } from "@db/entities/Variant";
import { IFormDataFile } from "types/IFormDataFile";
import { TransactionResult } from "types/TransactionResult";
import { Bundle } from "@db/entities/Bundle";

export interface IBaseFileService {
  downloadBundle(arg: {
    bundle: Bundle;
    response: Response;
  }): void | Promise<void>;

  getContent(arg: {
    variant: Variant;
    from: { workspaceId: number };
  }): Promise<string | null>;

  handleUpload(arg: {
    files: IFormDataFile[];
    author: { userId: number };
    target: { workspaceId: number };
  }): Promise<TransactionResult<File[]>>;

  // @NOTE consider refactor to be less generic, but more readable (because for now we only use it to write "bundle" zip)
  writeFile(arg: {
    buffer: Buffer;
    filename: string;
    pathToFile?: string;
  }): Promise<{ size: number } | null>;

  deleteFile(arg: { filename: string; pathToFile?: string }): Promise<void>;

  writeVariantFile(arg: {
    filename: string;
    workspaceId: number;
    file: IFormDataFile;
  }): Promise<void>;

  removeAllFromTemporaryDir(): Promise<void>;

  removeFromTemporaryDir(arg: {
    files: IFormDataFile[];
    from: { workspaceId: number };
  }): Promise<void>;

  moveFromDirToDir(arg: {
    workspaceId: number;
    from: { directoryId: number };
    to: { directoryId: number };
  }): Promise<TransactionResult<void>>;

  softDeleteFileAndVariants(id: number): Promise<TransactionResult<void>>;
}
