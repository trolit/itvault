import { Permission } from "@enums/Permission";
import { PermissionDto } from "@dtos/PermissionDto";

export const isPermissionEnabled = (
  permission: Permission,
  source: PermissionDto[] | RequestPermissions
): boolean => {
  if (Array.isArray(source)) {
    const result = source.find(({ signature }) => signature === permission);

    return !!result && result.enabled;
  }

  return !!source[permission];
};
