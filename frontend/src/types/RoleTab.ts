import type { IRoleDto } from "@shared/types/dtos/IRoleDto";
import type { IPermissionDto } from "@shared/types/dtos/IPermissionDto";

export type RoleTab = {
  role: IRoleDto;

  permissions: IPermissionDto[];
};
