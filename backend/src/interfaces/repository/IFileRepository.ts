import formidable from "formidable";
import { UpdateResult } from "typeorm";

import { File } from "@entities/File";
import { IBaseRepository } from "./IBaseRepository";

export interface IFileRepository extends IBaseRepository<File> {
  store(workspaceId: number, files: formidable.Files): Promise<File[]>;

  updateRelativePath(
    workspaceId: number,
    fileId: number,
    relativePath: string
  ): Promise<UpdateResult>;

  getAllByRelativePath(
    workspaceId: number,
    relativePath: string
  ): Promise<File[]>;

  getOne(workspaceId: number, fileId: number): Promise<File | null>;
}
