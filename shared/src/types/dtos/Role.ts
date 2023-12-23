import { IPermissionDto } from "./Permission";

export interface IRolePermissionDto extends IPermissionDto {
  enabled: boolean;
}
