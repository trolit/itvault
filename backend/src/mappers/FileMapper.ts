import { BaseMapper } from "./BaseMapper";

import { File } from "@entities/File";
import { IFileDto } from "@shared/types/dtos/IFileDto";

export class FileMapper extends BaseMapper<File> implements IFileDto {
  id: number;
  originalFilename: string;
  relativePath: string;
  createdAt: string;
  updatedAt: string;
  blueprintId: number;

  constructor(
    data: File,
    keys: (keyof File)[] = ["id", "originalFilename", "createdAt", "updatedAt"]
  ) {
    super(data, keys);

    if (data.directory) {
      this.relativePath = data.directory.relativePath;
    }

    return this;
  }
}
