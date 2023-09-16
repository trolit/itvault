import { File } from "@entities/File";
import { IFormDataFile } from "types/IFormDataFile";
import { TransactionResult } from "types/TransactionResult";

export interface IBaseFileService {
  softDeleteFileAndVariants(id: number): Promise<TransactionResult<void>>;

  handleUpload(
    userId: number,
    workspaceId: number,
    formDataFiles: IFormDataFile[]
  ): Promise<TransactionResult<File[]>>;
}
