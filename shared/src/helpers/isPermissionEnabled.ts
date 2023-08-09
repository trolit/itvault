import { Permission } from "../types/enums/Permission";
import { PermissionDto } from "../types/dtos/PermissionDto";

export const isPermissionEnabled = <T = void>(
  permission: Permission,
  source: PermissionDto[] | T
): boolean => {
  if (Array.isArray(source)) {
    const result = source.find(({ signature }) => signature === permission);

    return !!result && result.enabled;
  }

  return !!source[permission];
};
