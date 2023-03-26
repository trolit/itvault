import { Permission } from "@entities/Permission";

export class UserDto {
  email = "";

  roleId: number;

  roleName: string;

  permissions: Permission[];
}
