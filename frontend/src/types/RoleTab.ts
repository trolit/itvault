import type { AddEditRoleDto } from "@shared/types/dtos/AddEditRoleDto";
import type { IRolePermissionDto } from "@shared/types/dtos/Permission";

export type Form = Pick<AddEditRoleDto, "name" | "description"> & {
  permissions: IRolePermissionDto[];
};

export type RoleTab = {
  roleId: number;

  initialForm: Form;

  currentForm: Form;
};
