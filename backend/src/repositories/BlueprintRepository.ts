import { Repository } from "typeorm";
import { injectable } from "tsyringe";

import { Blueprint } from "@entities/Blueprint";
import { BaseRepository } from "./BaseRepository";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";
import { IBlueprintRepository } from "@interfaces/repository/IBlueprintRepository";

@injectable()
export class BlueprintRepository
  extends BaseRepository<Blueprint>
  implements IBlueprintRepository
{
  protected database: Repository<Blueprint>;

  constructor() {
    super(Blueprint);
  }

  findAllByWorkspaceId(
    id: number,
    options?: { pagination: IPaginationOptions }
  ): Promise<[Blueprint[], number]> {
    const pagination = options?.pagination
      ? { skip: options.pagination.skip, take: options.pagination.take }
      : undefined;

    return this.database.findAndCount({
      ...pagination,
      where: {
        workspace: {
          id,
        },
      },
    });
  }
}
