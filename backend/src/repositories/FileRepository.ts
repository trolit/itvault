import { injectable } from "tsyringe";
import { File } from "@db/entities/File";
import { IFileRepository } from "types/repositories/IFileRepository";

import { BaseRepository } from "./BaseRepository";

@injectable()
export class FileRepository
  extends BaseRepository<File>
  implements IFileRepository
{
  constructor() {
    super(File);
  }

  getAllByRelativePath(
    workspaceId: number,
    relativePath: string
  ): Promise<File[]> {
    return this.database.find({
      order: {
        originalFilename: "ASC",
      },
      where: {
        directory: {
          relativePath,
        },
        workspace: {
          id: workspaceId,
        },
      },
      relations: {
        directory: true,
      },
    });
  }

  getAllByBlueprintId(workspaceId: number, blueprintId: number) {
    return this.database.find({
      order: {
        originalFilename: "ASC",
      },
      select: {
        id: true,
        originalFilename: true,
        variants: {
          id: true,
          name: true,
        },
        directory: {
          relativePath: true,
        },
      },
      where: {
        workspace: {
          id: workspaceId,
        },
        variants: {
          buckets: {
            blueprint: {
              id: blueprintId,
            },
          },
        },
      },
      relations: {
        variants: true,
        directory: true,
      },
    });
  }
}
