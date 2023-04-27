import { PermissionDto } from "./PermissionDto";

type UpdatePermissionDto = Omit<PermissionDto, "name">;

export class UpdateRoleDto {
  name: string;

  permissions: UpdatePermissionDto[];
}
