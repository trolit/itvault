import path from "path";
import fs from "fs-extra";
import { injectable } from "tsyringe";

import { FILES } from "@config";
import { IFormDataFile } from "types/interfaces/IFormDataFile";
import { IBaseFileService } from "types/interfaces/service/IBaseFileService";

@injectable()
export class LocalFileService implements IBaseFileService {
  async moveFilesFromTemporaryDir(
    workspaceId: number,
    formDataFiles: IFormDataFile[]
  ): Promise<void> {
    const { BASE_TEMPORARY_UPLOADS_PATH, BASE_UPLOADS_PATH } = FILES;

    await fs.ensureDir(FILES.BASE_UPLOADS_PATH);

    for (const { file } of formDataFiles) {
      const { newFilename } = file;

      const src = path.join(
        BASE_TEMPORARY_UPLOADS_PATH,
        `workspace-${workspaceId}`,
        newFilename
      );

      const dest = path.join(
        BASE_UPLOADS_PATH,
        `workspace-${workspaceId}`,
        newFilename
      );

      try {
        await fs.move(src, dest);
      } catch (error) {
        console.error(error);
      }
    }
  }
}
