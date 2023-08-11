import { Repository } from "typeorm";
import { injectable } from "tsyringe";
import { IDirectoryRepository } from "types/repositories/IDirectoryRepository";

import { BaseRepository } from "./BaseRepository";

import { Directory } from "@entities/Directory";

@injectable()
export class DirectoryRepository
  extends BaseRepository<Directory>
  implements IDirectoryRepository
{
  protected database: Repository<Directory>;

  constructor() {
    super(Directory);
  }
}
