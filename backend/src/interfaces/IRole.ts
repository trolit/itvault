import { Permission } from "@enums/Permission";

export interface IRole {
  name: string;

  permissions: Permission[];
}
