export interface IPermissionDTO {
  signature: string;

  name: string;

  group: string;
}

export interface IPermissionUpdateDTO {
  signature: string;

  enabled: boolean;
}
