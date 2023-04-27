import {
  In,
  Repository,
  FindOptionsWhere,
  FindOptionsRelations,
} from "typeorm";
import { injectable } from "tsyringe";

import { Role } from "@entities/Role";
import { BaseRepository } from "./BaseRepository";
import { IRoleRepository } from "@interfaces/repository/IRoleRepository";

@injectable()
export class RoleRepository
  extends BaseRepository<Role>
  implements IRoleRepository
{
  protected database: Repository<Role>;

  constructor() {
    super(Role);
  }

  getAll(options?: {
    includePermissions?: boolean;
    filters?: {
      ids?: number[];
    };
    pagination?: {
      take: number;
      skip: number;
    };
  }): Promise<[Role[], number]> {
    const where: FindOptionsWhere<Role> = {};

    if (options?.filters?.ids) {
      where.id = In(options.filters.ids);
    }

    const relations: FindOptionsRelations<Role> | undefined =
      options?.includePermissions
        ? {
            permissionToRole: {
              permission: true,
            },
          }
        : undefined;

    const pagination = (() => {
      if (options?.pagination) {
        const { take, skip } = options.pagination;

        return { take, skip };
      }

      return {};
    })();

    return this.database.findAndCount({
      ...pagination,
      where,
      relations,
    });
  }

  findByName(name: string): Promise<Role | null> {
    return this.database.findOneBy({ name });
  }
}
