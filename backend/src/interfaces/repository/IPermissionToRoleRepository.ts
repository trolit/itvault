import { PermissionToRole } from "@entities/PermissionToRole";

export interface IPermissionToRoleRepository {
  getRolePermission(
    roleId: number,
    permissionId: number
  ): Promise<PermissionToRole | null>;
}
