import { injectable } from "tsyringe";
import { IsNull, Repository } from "typeorm";

import { Workspace } from "@entities/Workspace";
import { BaseRepository } from "./BaseRepository";
import { IWorkspaceRepository } from "@interfaces/IWorkspaceRepository";

@injectable()
export class WorkspaceRepository
  extends BaseRepository<Workspace>
  implements IWorkspaceRepository
{
  protected database: Repository<Workspace>;

  constructor() {
    super(Workspace);
  }

  getAll(
    take: number,
    skip: number,
    userId?: number
  ): Promise<[result: Workspace[], total: number]> {
    const userIdQuery = userId
      ? {
          where: {
            deletedAt: IsNull(),
            userToWorkspace: {
              userId,
            },
          },
          relations: {
            userToWorkspace: true,
          },
        }
      : {};

    return this.database.findAndCount({
      take,
      skip,
      order: {
        name: "asc",
      },
      ...userIdQuery,
    });
  }
}
