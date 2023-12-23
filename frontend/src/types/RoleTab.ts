import type { IRolePermissionDto } from "@shared/types/dtos/Role";
import type { AddEditRoleDto } from "@shared/types/dtos/AddEditRoleDto";

export type Form = Pick<AddEditRoleDto, "name" | "description"> & {
  permissions: IRolePermissionDto[];
};

export type RoleTab = {
  roleId: number;

  initialForm: Form;

  currentForm: Form;
};
