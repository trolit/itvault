import { PermissionDto } from "./PermissionDto";

export interface ILoggedUserDto {
  id: number;

  email: string;

  fullName: string;

  roleId: number;

  roleName: string;

  permissions: PermissionDto[];
}
