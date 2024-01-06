import { File } from "@entities/File";
import { Variant } from "@entities/Variant";
import { IFormDataFile } from "types/IFormDataFile";
import { TransactionResult } from "types/TransactionResult";

export interface IBaseFileService {
  readWorkspaceFile(
    workspaceId: number,
    variant: Variant
  ): Promise<string | null>;

  saveFiles(
    userId: number,
    workspaceId: number,
    formDataFiles: IFormDataFile[]
  ): Promise<TransactionResult<File[]>>;

  clearTemporaryDir(): Promise<void>;

  clearSpecificFilesFromTemporaryDir(
    workspaceId: number,
    formDataFiles: IFormDataFile[]
  ): Promise<void>;

  moveFilesFromDirToDir(
    workspaceId: number,
    sourceDirectoryId: number,
    targetDirectoryId: number
  ): Promise<TransactionResult<void>>;

  softDeleteFileAndVariants(id: number): Promise<TransactionResult<void>>;
}
