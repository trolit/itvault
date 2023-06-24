import { Variant } from "@entities/Variant";
import { IFormDataFile } from "@interfaces/IFormDataFile";

export interface IBaseFileService {
  moveFilesFromTemporaryDir(
    workspaceId: number,
    formDataFiles: IFormDataFile[]
  ): Promise<void>;

  readFile(workspaceId: number, variant: Variant): Promise<string>;
}
