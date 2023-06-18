import { IFormDataFile } from "@interfaces/IFormDataFile";

export interface IBaseFileService {
  moveFilesFromTemporaryDir(
    workspaceId: number,
    formDataFiles: IFormDataFile[]
  ): void;
}
