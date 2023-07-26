import { File } from "@entities/File";
import { BaseMapDto } from "./BaseMapDto";

export class FileMapDto extends BaseMapDto<File> {
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
