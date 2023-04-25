import { injectable } from "tsyringe";
import { FindOptionsRelations, FindOptionsWhere, Repository } from "typeorm";

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
    includePermissions: boolean;
    where?: FindOptionsWhere<Role>;
  }): Promise<Role[]> {
    const where: FindOptionsWhere<Role> | undefined = options?.where;

    const relations: FindOptionsRelations<Role> | undefined =
      options?.includePermissions
        ? {
            permissionToRole: {
              permission: true,
            },
          }
        : undefined;

    return this.database.find({
      where,
      relations,
    });
  }

  findByName(name: string): Promise<Role | null> {
    return this.database.findOneBy({ name });
  }
}
