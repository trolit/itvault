import type {
  IAddEditRoleDTO,
  IRolePermissionDTO,
} from "@shared/types/DTOs/Role";

export type Form = Pick<IAddEditRoleDTO, "name" | "description"> & {
  permissions: IRolePermissionDTO[];
};

export type RoleTab = {
  roleId: number;

  initialForm: Form;

  currentForm: Form;
};
