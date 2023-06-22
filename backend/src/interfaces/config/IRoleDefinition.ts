import { Permission } from "types/enums/Permission";

export interface IRoleDefinition {
  name: string;

  permissions: Permission[];
}
