import { UpdatePermissionDto } from "./UpdatePermissionDto";

export type AddEditRoleDto = {
  name: string;

  description: string;

  permissions: UpdatePermissionDto[];
};
