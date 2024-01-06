import { File } from "@entities/File";
import { Variant } from "@entities/Variant";
import { IFormDataFile } from "types/IFormDataFile";
import { TransactionResult } from "types/TransactionResult";

export interface IBaseFileService {
  getContent(arg: {
    variant: Variant;
    from: { workspaceId: number };
  }): Promise<string | null>;

  handleUpload(arg: {
    files: IFormDataFile[];
    author: { userId: number };
    target: { workspaceId: number };
  }): Promise<TransactionResult<File[]>>;

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

  writeFile(arg: {
    buffer: Buffer;
    filename: string;
    pathToFile: string;
  }): Promise<{ size: number } | null>;
}
