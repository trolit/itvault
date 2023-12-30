import { IAuthorDTO } from "./User";
import { IPermissionDTO, IPermissionUpdateDTO } from "./Permission";

export interface IRoleDto {
  id: number;

  name: string;

  description: string;

  createdAt: string;

  updatedAt: string;

  createdBy: IAuthorDTO | null;

  updatedBy: IAuthorDTO | null;
}

export interface IRolePermissionDTO extends IPermissionDTO {
  enabled: boolean;
}

export interface IAddEditRoleDto {
  name: string;

  description: string;

  permissions: IPermissionUpdateDTO[];
}
