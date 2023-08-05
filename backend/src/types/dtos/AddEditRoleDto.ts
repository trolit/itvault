import { PermissionDto } from "./PermissionDto";

export type UpdatePermissionDto = Omit<PermissionDto, "name" | "group">;

export class AddEditRoleDto {
  name: string;

  permissions: UpdatePermissionDto[];
}
