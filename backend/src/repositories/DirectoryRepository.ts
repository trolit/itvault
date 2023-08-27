import uniq from "lodash/uniq";
import { injectable } from "tsyringe";
import { In, Repository } from "typeorm";
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

  private async _handleRootRelativePathRequest(workspaceId: number) {
    // @NOTE (1) fetch all workspace related directories
    const directories = await this.database.find({
      where: { files: { workspace: { id: workspaceId } } },
    });

    // @NOTE (2) take all unique "root" children dirs
    const rootDirectories = uniq(
      directories.map(({ relativePath }) => {
        const splitRelativePath = relativePath.split("/");

        if (splitRelativePath.length <= 2) {
          return relativePath;
        }

        const [, rootDir] = splitRelativePath;

        return `${FILES.ROOT}/${rootDir}`;
      })
    );

    // @NOTE (3) fetch all root dirs from DB
    return this.database.find({
      where: { relativePath: In(rootDirectories) },
    });
  }

  getAllByRelativePath(workspaceId: number, relativePath: string) {
    if (relativePath === FILES.ROOT) {
      return this._handleRootRelativePathRequest(workspaceId);
    }

    return this.database.find({
      where: {
        files: {
          workspace: {
            id: workspaceId,
          },
        },
        parentDirectory: {
          relativePath,
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
