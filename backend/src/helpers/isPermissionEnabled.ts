import { Permission } from "@enums/Permission";
import { PermissionDto } from "@dtos/PermissionDto";
import { RequestPermissions } from "@custom-types/express";

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
