import type { AddEditRoleDto } from "@shared/types/dtos/AddEditRoleDto";
import type { IRolePermissionDto } from "@shared/types/dtos/IRolePermissionDto";

export type Form = Pick<AddEditRoleDto, "name"> & {
  permissions: IRolePermissionDto[];
};

export type RoleTab = {
  roleId: number;

  initialForm: Form;

  currentForm: Form;
};
