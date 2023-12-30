import type {
  IAddEditRoleDto,
  IRolePermissionDTO,
} from "@shared/types/dtos/Role";

export type Form = Pick<IAddEditRoleDto, "name" | "description"> & {
  permissions: IRolePermissionDTO[];
};

export type RoleTab = {
  roleId: number;

  initialForm: Form;

  currentForm: Form;
};
