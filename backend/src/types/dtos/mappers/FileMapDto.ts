import { File } from "@entities/File";
import { BaseMapDto } from "./BaseMapDto";
import { IFileDto } from "@shared/types/dtos/IFileDto";

export class FileMapDto extends BaseMapDto<File> implements IFileDto {
  id: number;
  originalFilename: string;
  relativePath: string;
  createdAt: string;
  updatedAt: string;
  blueprintId: number;

  constructor(
    data: File,
    keys: (keyof File)[] = [
      "id",
      "originalFilename",
      "relativePath",
      "createdAt",
      "updatedAt",
    ]
  ) {
    super(data, keys);

    return this;
  }
}
