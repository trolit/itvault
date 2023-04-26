import { PermissionDto } from "./PermissionDto";

export class UserDto {
  id = -1;

  email = "";

  roleId: number;

  roleName: string;

  permissions: PermissionDto[];
}
