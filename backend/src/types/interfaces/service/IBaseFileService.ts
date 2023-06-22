import { IFormDataFile } from "types/interfaces/IFormDataFile";

export interface IBaseFileService {
  moveFilesFromTemporaryDir(
    workspaceId: number,
    formDataFiles: IFormDataFile[]
  ): Promise<void>;
}
