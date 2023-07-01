import { Variant } from "@entities/Variant";
import { IFormDataFile } from "@interfaces/IFormDataFile";

export interface IFileService {
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
}
