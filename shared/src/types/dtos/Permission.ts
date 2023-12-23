export interface IPermissionDto {
  signature: string;

  name: string;

  group: string;
}

export interface IPermissionUpdateDto {
  signature: string;

  enabled: boolean;
}
