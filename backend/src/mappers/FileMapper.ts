import { BaseMapper } from "./BaseMapper";

import { File } from "@entities/File";
import { IFileDto } from "@shared/types/dtos/File";

export class FileMapper extends BaseMapper<File> implements IFileDto {
  id: number;
  originalFilename: string;
  relativePath: string;
  createdAt: string;
  updatedAt: string;

  constructor(data: File) {
    super(data, ["id", "originalFilename", "createdAt", "updatedAt"]);

    this.assignInitialKeys();

    if (data.directory) {
      this.relativePath = data.directory.relativePath;
    }

    return this;
  }
}
