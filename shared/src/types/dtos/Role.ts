import { IPermissionDto, IPermissionUpdateDto } from "./Permission";

export interface IRolePermissionDto extends IPermissionDto {
  enabled: boolean;
}

export interface IRoleAddEditDto {
  name: string;

  description: string;

  permissions: IPermissionUpdateDto[];
}
