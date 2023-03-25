export interface IRoleService {
  isPermissionEnabled(roleId: number, permissionId: number): Promise<boolean>;
}
