import { IAuthorDto } from "./User";
import { IPermissionDto, IPermissionUpdateDto } from "./Permission";

export interface IRoleDto {
  id: number;

  name: string;

  description: string;

  createdAt: string;

  updatedAt: string;

  createdBy: IAuthorDto | null;

  updatedBy: IAuthorDto | null;
}

export interface IRolePermissionDto extends IPermissionDto {
  enabled: boolean;
}

export interface IRoleAddEditDto {
  name: string;

  description: string;

  permissions: IPermissionUpdateDto[];
}
