import { Permission } from "@shared/types/enums/Permission";
import { PermissionDto } from "@shared/types/dtos/PermissionDto";

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
