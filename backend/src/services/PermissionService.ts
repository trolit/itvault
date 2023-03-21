import { Permission } from "@enums/Permission";
import { dataSource } from "@config/data-source";
import { PermissionToRole } from "@entities/PermissionToRole";
import { PermissionToRoleRepository } from "@repositories/PermissionToRoleRepository";

export class PermissionService {
  _permissionToRoleRepository: PermissionToRoleRepository;

  constructor() {
    this._permissionToRoleRepository =
      dataSource.getRepository(PermissionToRole);
  }

  async hasPermission(roleId: number, permissionId: Permission) {
    const result = await this._permissionToRoleRepository.findOneBy({
      permissionId,
      roleId,
    });

    return !!result;
  }
}
