import { PermissionDto } from "@dtos/PermissionDto";
import { Permission } from "@enums/Permission";

export const isPermissionEnabled = (
  permission: Permission,
  userPermissions: PermissionDto[]
): boolean => {
  const result = userPermissions.find(({ id }) => id === permission);

  return !!result && result.enabled;
};
