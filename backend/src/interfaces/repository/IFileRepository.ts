import formidable from "formidable";

import { File } from "@entities/File";
import { IBaseRepository } from "./IBaseRepository";

export interface IFileRepository extends IBaseRepository<File> {
  saveMany(workspaceId: number, files: formidable.Files): Promise<File[]>;

  getAllByRelativePath(
    workspaceId: number,
    relativePath: string
  ): Promise<File[]>;
}
