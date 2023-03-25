import { Permission } from "@enums/Permission";

export interface IRoleDefinition {
  name: string;

  permissions: Permission[];
}
