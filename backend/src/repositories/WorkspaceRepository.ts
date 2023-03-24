import { injectable } from "tsyringe";
import { IsNull, Repository } from "typeorm";

import { Workspace } from "@entities/Workspace";
import { dataSource } from "@config/data-source";
import { IWorkspaceRepository } from "@interfaces/IWorkspaceRepository";

@injectable()
export class WorkspaceRepository implements IWorkspaceRepository {
  private database: Repository<Workspace>;

  constructor() {
    this.database = dataSource.getRepository(Workspace);
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
            relations: {
              userToWorkspace: true,
            },
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
