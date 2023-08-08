import { IPermissionDefinition } from "./IPermissionDefinition";

export interface IRoleDefinition {
  name: string;

  permissions: IPermissionDefinition[];
}
