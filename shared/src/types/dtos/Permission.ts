export interface IPermissionDto {
  signature: string;

  name: string;

  group: string;
}

export interface IRolePermissionDto extends IPermissionDto {
  enabled: boolean;
}
