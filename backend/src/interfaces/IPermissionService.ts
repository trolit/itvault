import { Permission } from "@enums/Permission";

export interface IPermissionService {
  hasPermission(userId: number, permission: Permission): Promise<boolean>;
}
