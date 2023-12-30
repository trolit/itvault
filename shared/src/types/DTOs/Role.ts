import { IAuthorDTO } from "./User";
import { IPermissionDTO, IPermissionUpdateDTO } from "./Permission";

export interface IRoleDTO {
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

export interface IAddEditRoleDTO {
  name: string;

  description: string;

  permissions: IPermissionUpdateDTO[];
}
