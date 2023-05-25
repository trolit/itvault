import formidable from "formidable";

import { File } from "@entities/File";
import { IBaseRepository } from "./IBaseRepository";

export interface IFileRepository extends IBaseRepository<File> {
  store(file: formidable.File, relativePath: string): Promise<File | null>;
}
