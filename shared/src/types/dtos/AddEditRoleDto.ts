import { IPermissionUpdateDto } from "./Permission";

export type AddEditRoleDto = {
  name: string;

  description: string;

  permissions: IPermissionUpdateDto[];
};
