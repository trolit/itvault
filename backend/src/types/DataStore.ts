import { Permission as PermissionEntity } from "@entities/Permission";
import { PermissionToRole } from "@entities/PermissionToRole";

export namespace DataStore {
  export const enum KeyType {
    AuthenticatedUser = "authenticated-user",
    Role = "role",
  }

  export type Key = [string | number, KeyType];

  export type Permission = Pick<PermissionEntity, "signature" | "name"> &
    Pick<PermissionToRole, "enabled">;

  export type Role = {
    id: number;

    permissions: Permission[];
  };

  export type User = {
    id: string;

    roleId: string;
  };
}
