import { IPermissionDto } from "./IPermissionDto";

export interface ILoggedUserDto {
  id: number;

  email: string;

  fullName: string;

  roleId: number;

  roleName: string;

  permissions: IPermissionDto[];
}
