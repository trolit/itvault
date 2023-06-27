import { PermissionDto } from "./PermissionDto";

export class UserDto {
  id = -1;

  email = "";

  fullName = "";

  roleId: number;

  roleName: string;

  permissions: PermissionDto[];
}
