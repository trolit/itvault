/* eslint-disable @typescript-eslint/consistent-type-definitions */

declare module "@custom-types/data-store" {
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
