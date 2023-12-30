import { Permission } from "../types/enums/Permission";
import { IRolePermissionDTO } from "../types/DTOs/Role";

export const isPermissionEnabled = <T = void>(
  permission: Permission,
  source: IRolePermissionDTO[] | T
): boolean => {
  if (Array.isArray(source)) {
    const result = source.find(({ signature }) => signature === permission);

    return !!result && result.enabled;
  }

  return !!source[permission];
};
