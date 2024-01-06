import { IBaseFileService } from "./IBaseFileService";
import { IFormDataFile } from "types/IFormDataFile";

export interface IFileService extends IBaseFileService {
  moveWorkspaceFilesFromTemporaryDir(arg: {
    files: IFormDataFile[];
    workspaceId: number;
  }): Promise<void>;
}
