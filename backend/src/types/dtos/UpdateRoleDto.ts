import { PermissionDto } from "./PermissionDto";

export type UpdatePermissionDto = Omit<PermissionDto, "name">;

export class UpdateRoleDto {
  name: string;

  permissions: UpdatePermissionDto[];
}
