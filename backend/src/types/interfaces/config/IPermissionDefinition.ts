import { Permission } from "@shared/types/enums/Permission";
import { PermissionGroup } from "@enums/PermissionGroup";

export interface IPermissionDefinition {
  signature: Permission;

  name: string;

  group: PermissionGroup;
}
