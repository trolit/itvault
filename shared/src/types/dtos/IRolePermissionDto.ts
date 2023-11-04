import { IPermissionDto } from "./IPermissionDto";

export interface IRolePermissionDto extends IPermissionDto {
  enabled: boolean;
}
