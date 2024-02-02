import uniq from "lodash/uniq";
import { injectable } from "tsyringe";
import { In, Like, Not } from "typeorm";
import { Directory } from "@db/entities/Directory";
import { IDirectoryRepository } from "types/repositories/IDirectoryRepository";

import { FILES } from "@config";

import { BaseRepository } from "./BaseRepository";

@injectable()
export class DirectoryRepository
  extends BaseRepository<Directory>
  implements IDirectoryRepository
{
  constructor() {
    super(Directory);
  }

  private async _handleRootRelativePathRequest(workspaceId: number) {
    // @NOTE (1) fetch all workspace related directories
    const directories = await this.database.find({
      where: {
        relativePath: Not(FILES.ROOT),
        files: { workspace: { id: workspaceId } },
      },
    });

    // @NOTE (2) take all "root" children dirs
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

  async getAllByRelativePath(workspaceId: number, relativePath: string) {
    if (relativePath === FILES.ROOT) {
      return this._handleRootRelativePathRequest(workspaceId);
    }

    // @NOTE (1) fetch all dirs with matching relativePath and workspace
    const directories = await this.database.find({
      where: {
        files: {
          workspace: {
            id: workspaceId,
          },
        },
        parentDirectory: {
          relativePath: Like(`${relativePath}%`),
        },
      },
    });

    const relativePathLength = relativePath.split("/").length;

    // @NOTE (2) take all relativePath children dirs
    const relativePathChildrenDirectories = uniq(
      directories.map(dir => {
        const splitPath = dir.relativePath.split("/");

        return splitPath.splice(0, relativePathLength + 1).join("/");
      })
    );

    // @NOTE (3) fetch all children dirs
    return this.database.find({
      where: { relativePath: In(relativePathChildrenDirectories) },
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
