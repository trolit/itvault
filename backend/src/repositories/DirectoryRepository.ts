import { injectable } from "tsyringe";
import { Like, Not, Repository } from "typeorm";
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
    const relativePathQuery =
      relativePath === FILES.ROOT
        ? Not(Like(`${FILES.ROOT}/%/%`))
        : relativePath;

    return this.database.find({
      where: {
        relativePath: relativePathQuery,
        files: {
          workspace: {
            id: workspaceId,
          },
        },
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
