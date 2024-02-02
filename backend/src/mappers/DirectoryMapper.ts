import { Directory } from "@db/entities/Directory";

import { BaseMapper } from "./BaseMapper";

import { IDirectoryDTO } from "@shared/types/DTOs/Directory";

export class DirectoryMapper
  extends BaseMapper<Directory>
  implements IDirectoryDTO
{
  id: number;
  relativePath: string;

  constructor(data: Directory) {
    super(data, ["id", "relativePath"]);

    this.assignInitialKeys();

    return this;
  }
}
