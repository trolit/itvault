import { BaseMapper } from "./BaseMapper";

import { Directory } from "@entities/Directory";
import { IDirectoryDto } from "@shared/types/dtos/Directory";

export class DirectoryMapper
  extends BaseMapper<Directory>
  implements IDirectoryDto
{
  id: number;
  relativePath: string;

  constructor(data: Directory) {
    super(data, ["id", "relativePath"]);

    this.assignInitialKeys();

    return this;
  }
}
