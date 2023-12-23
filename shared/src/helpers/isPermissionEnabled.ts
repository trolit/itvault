import { Permission } from "../types/enums/Permission";
import { IRolePermissionDto } from "../types/dtos/Permission";

export const isPermissionEnabled = <T = void>(
  permission: Permission,
  source: IRolePermissionDto[] | T
): boolean => {
  if (Array.isArray(source)) {
    const result = source.find(({ signature }) => signature === permission);

    return !!result && result.enabled;
  }

  return !!source[permission];
};
