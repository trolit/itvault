import { Permission } from "@enums/Permission";
import { RequestPermissions } from "@utils/types";
import { PermissionDto } from "@dtos/PermissionDto";

export const isPermissionEnabled = (
  permission: Permission,
  source: PermissionDto[] | RequestPermissions
): boolean => {
  if (Array.isArray(source)) {
    const result = source.find(({ id }) => id === permission);

    return !!result && result.enabled;
  }

  return !!source[permission];
};
