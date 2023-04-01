import { PermissionDto } from "./PermissionDto";

export class UserDto {
  email = "";

  roleId: number;

  roleName: string;

  permissions: PermissionDto[];

  isActive = true;
}
