import { Permission as PermissionEntity } from "@db/entities/Permission";
import { PermissionToRole } from "@db/entities/PermissionToRole";

export namespace DataStore {
  export const enum KeyType {
    AuthenticatedUser = "session",
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
  };
}
