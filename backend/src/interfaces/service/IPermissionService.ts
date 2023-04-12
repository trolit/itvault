import { Permission } from "@enums/Permission";
import { DataStorePermission } from "@utils/DataStoreRole";

export interface IPermissionService {
  getUserPermissions(userId: number): Promise<DataStorePermission[] | null>;

  hasPermission(userId: number, permission: Permission): Promise<boolean>;
}
