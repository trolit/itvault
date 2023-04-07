export class DataStoreRole {
  id: number;

  permissions: DataStorePermission[];
}

export class DataStorePermission {
  id: number;

  name: string;

  enabled: boolean;
}
