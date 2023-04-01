import { PermissionDto } from "@dtos/PermissionDto";
import { Permission } from "@enums/Permission";

export const findPermissionInCollection = (
  permission: Permission,
  collection: PermissionDto[]
) => collection.find(({ id }) => id === permission);
