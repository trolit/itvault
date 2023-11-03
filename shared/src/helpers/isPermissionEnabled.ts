import { Permission } from "../types/enums/Permission";
import { IPermissionDto } from "../types/dtos/IPermissionDto";

export const isPermissionEnabled = <T = void>(
  permission: Permission,
  source: IPermissionDto[] | T
): boolean => {
  if (Array.isArray(source)) {
    const result = source.find(({ signature }) => signature === permission);

    return !!result && result.enabled;
  }

  return !!source[permission];
};
