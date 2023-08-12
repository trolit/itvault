import { BaseMapper } from "./BaseMapper";

import { Directory } from "@entities/Directory";
import { IDirectoryDto } from "@shared/types/dtos/IDirectoryDto";

export class DirectoryMapper
  extends BaseMapper<Directory>
  implements IDirectoryDto
{
  id: number;
  relativePath: string;

  constructor(
    data: Directory,
    keys: (keyof Directory)[] = ["id", "relativePath"]
  ) {
    super(data, keys);

    return this;
  }
}
