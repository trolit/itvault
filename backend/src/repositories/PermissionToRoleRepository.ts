import { Repository } from "typeorm";
import { injectable } from "tsyringe";

import { BaseRepository } from "./BaseRepository";
import { PermissionToRole } from "@entities/PermissionToRole";
import { IPermissionToRoleRepository } from "@interfaces/repository/IPermissionToRoleRepository";

@injectable()
export class PermissionToRoleRepository
  extends BaseRepository<PermissionToRole>
  implements IPermissionToRoleRepository
{
  protected database: Repository<PermissionToRole>;

  constructor() {
    super(PermissionToRole);
  }

  getRolePermission(
    roleId: number,
    permissionId: number
  ): Promise<PermissionToRole | null> {
    return this.database.findOneBy({ roleId, permissionId });
  }
}
