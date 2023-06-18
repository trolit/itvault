import formidable from "formidable";
import { injectable } from "tsyringe";

import { IBaseFileService } from "@interfaces/service/IBaseFileService";

@injectable()
export class LocalFileService implements IBaseFileService {
  moveFilesFromTemporaryDir(
    workspaceId: number,
    files: formidable.Files
  ): Promise<{ isSuccess: boolean }> {
    throw new Error("Method not implemented.");
  }

  removeFiles(
    workspaceId: number,
    files: formidable.Files
  ): Promise<{ isSuccess: boolean }> {
    throw new Error("Method not implemented.");
  }
}
