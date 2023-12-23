import { IRolePermissionDto } from "./Role";

export interface ILoggedUserDto {
  id: number;

  email: string;

  fullName: string;

  roleId: number;

  roleName: string;

  permissions: IRolePermissionDto[];
}
