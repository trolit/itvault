import type { IRoleDto } from "@shared/types/dtos/IRoleDto";
import type { IRolePermissionDto } from "@shared/types/dtos/IRolePermissionDto";

export type RoleTab = {
  role: IRoleDto;

  initialPermissions: IRolePermissionDto[];

  permissions: IRolePermissionDto[];
};
