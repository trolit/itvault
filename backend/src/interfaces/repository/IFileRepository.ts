import formidable from "formidable";

import { File } from "@entities/File";
import { IBaseRepository } from "./IBaseRepository";

export interface IFileRepository extends IBaseRepository<File> {
  save(workspaceId: number, files: formidable.Files): Promise<File[] | null>;

  getAllByRelativePath(
    workspaceId: number,
    relativePath: string
  ): Promise<File[]>;
}
