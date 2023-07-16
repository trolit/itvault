import { PermissionDto } from "./PermissionDto";

export type UpdatePermissionDto = Omit<PermissionDto, "name">;

export class AddEditRoleDto {
  name: string;

  permissions: UpdatePermissionDto[];
}
