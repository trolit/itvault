import { injectable } from "tsyringe";
import { And, Like, Not, Repository } from "typeorm";
import { IDirectoryRepository } from "types/repositories/IDirectoryRepository";

import { FILES } from "@config";

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

  getAllByRelativePath(workspaceId: number, relativePath: string) {
    const query =
      relativePath === FILES.ROOT
        ? { relativePath: And(Not(Like(`${FILES.ROOT}/%/%`)), Not(FILES.ROOT)) }
        : { parentDirectory: { relativePath } };

    return this.database.find({
      where: {
        files: {
          workspace: {
            id: workspaceId,
          },
        },
        ...query,
      },
    });
  }

  getAllByBlueprintId(workspaceId: number, blueprintId: number) {
    return this.database.find({
      where: {
        files: {
          workspace: {
            id: workspaceId,
            blueprints: {
              id: blueprintId,
            },
          },
        },
      },
    });
  }
}
