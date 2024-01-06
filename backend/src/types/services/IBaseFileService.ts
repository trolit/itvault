import { File } from "@entities/File";
import { IFormDataFile } from "types/IFormDataFile";
import { TransactionResult } from "types/TransactionResult";

export interface IBaseFileService {
  saveFiles(
    userId: number,
    workspaceId: number,
    formDataFiles: IFormDataFile[]
  ): Promise<TransactionResult<File[]>>;

  moveFilesFromDirToDir(
    workspaceId: number,
    sourceDirectoryId: number,
    targetDirectoryId: number
  ): Promise<TransactionResult<void>>;

  softDeleteFileAndVariants(id: number): Promise<TransactionResult<void>>;
}
