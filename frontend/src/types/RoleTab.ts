import type {
  IRoleAddEditDto,
  IRolePermissionDto,
} from "@shared/types/dtos/Role";

export type Form = Pick<IRoleAddEditDto, "name" | "description"> & {
  permissions: IRolePermissionDto[];
};

export type RoleTab = {
  roleId: number;

  initialForm: Form;

  currentForm: Form;
};
