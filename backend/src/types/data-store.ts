declare module "data-store-types" {
  import { Permission } from "@entities/Permission";
  import { PermissionToRole } from "@entities/PermissionToRole";

  export const enum DataStoreKeyType {
    AuthenticatedUser = "authenticated-user",
    Role = "role",
  }

  export type DataStoreKey = [string | number, DataStoreKeyType];

  export type DataStorePermission = Pick<Permission, "signature" | "name"> &
    Pick<PermissionToRole, "enabled">;

  export type DataStoreRole = {
    id: number;

    permissions: DataStorePermission[];
  };

  export type DataStoreUser = {
    id: string;

    roleId: string;
  };
}
