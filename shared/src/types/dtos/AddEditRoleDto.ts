import { UpdatePermissionDto } from "./UpdatePermissionDto";

export type AddEditRoleDto = {
  name: string;

  permissions: UpdatePermissionDto[];
};
