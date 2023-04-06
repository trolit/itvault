import { Repository } from "typeorm";
import { injectable } from "tsyringe";

import { Role } from "@entities/Role";
import { BaseRepository } from "./BaseRepository";
import { IRoleRepository } from "@interfaces/IRoleRepository";

@injectable()
export class RoleRepository
  extends BaseRepository<Role>
  implements IRoleRepository
{
  protected database: Repository<Role>;

  constructor() {
    super(Role);
  }

  getAll(): Promise<Role[]> {
    return this.database.find({
      relations: {
        permissionToRole: {
          permission: true,
        },
      },
    });
  }
}
