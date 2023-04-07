import { Repository } from "typeorm";
import { injectable } from "tsyringe";

import { Workspace } from "@entities/Workspace";
import { BaseRepository } from "./BaseRepository";
import { IWorkspaceRepository } from "@interfaces/repository/IWorkspaceRepository";

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
  ): Promise<[Workspace[], number]> {
    const userIdQuery = userId
      ? {
          where: {
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
