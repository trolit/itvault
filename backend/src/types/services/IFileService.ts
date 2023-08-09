import { Variant } from "@entities/Variant";
import { IBaseFileService } from "./IBaseFileService";
import { IFormDataFile } from "types/IFormDataFile";

export interface IFileService extends IBaseFileService {
  moveFilesFromTemporaryDir(
    workspaceId: number,
    formDataFiles: IFormDataFile[]
  ): Promise<void>;

  readFile(workspaceId: number, variant: Variant): Promise<string>;

  writeFile(
    filename: string,
    location: string,
    buffer: Buffer
  ): Promise<{ size: number } | null>;

  clearTemporaryDir(): Promise<void>;
}
