declare module "@custom-types/data-store" {
  export enum DataStoreKeyType {
    AuthenticatedUser = "authenticated-user",
    Role = "role",
  }

  export type DataStoreKey = [string | number, DataStoreKeyType];

  export type DataStorePermission = {
    id: number;

    name: string;

    enabled: boolean;
  };

  export type DataStoreRole = {
    id: number;

    permissions: DataStorePermission[];
  };

  export type DataStoreUser = {
    id: string;

    roleId: string;
  };
}
