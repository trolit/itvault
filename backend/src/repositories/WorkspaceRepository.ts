import { Repository } from "typeorm";
import { injectable } from "tsyringe";

import { Workspace } from "@entities/Workspace";
import { BaseRepository } from "./BaseRepository";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";
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

  getAll(options: {
    filters?: { userId?: number };
    pagination: IPaginationOptions;
  }): Promise<[result: Workspace[], total: number]> {
    const userIdQuery = options.filters?.userId
      ? {
          where: {
            userToWorkspace: {
              userId: options.filters.userId,
            },
          },
          relations: {
            userToWorkspace: true,
          },
        }
      : {};

    return this.database.findAndCount({
      ...options.pagination,
      order: {
        name: "asc",
      },
      ...userIdQuery,
    });
  }
}
