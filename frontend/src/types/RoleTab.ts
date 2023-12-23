import type {
  IAddEditRoleDto,
  IRolePermissionDto,
} from "@shared/types/dtos/Role";

export type Form = Pick<IAddEditRoleDto, "name" | "description"> & {
  permissions: IRolePermissionDto[];
};

export type RoleTab = {
  roleId: number;

  initialForm: Form;

  currentForm: Form;
};
