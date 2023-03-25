import { inject } from "tsyringe";

import { Di } from "@enums/Di";
import { Permission } from "@enums/Permission";
import { IRoleService } from "@interfaces/IRoleService";
import { IPermissionToRoleRepository } from "@interfaces/IPermissionToRoleRepository";

export class RoleService implements IRoleService {
  constructor(
    @inject(Di.PermissionToRoleRepository)
    private permissionToRoleRepository: IPermissionToRoleRepository
  ) {}

  async isPermissionEnabled(roleId: number, permissionId: Permission) {
    const permission = await this.permissionToRoleRepository.getRolePermission(
      roleId,
      permissionId
    );

    return !!permission && permission.enabled;
  }
}
