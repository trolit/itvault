import { BaseMapper } from "./BaseMapper";

import { Role } from "@entities/Role";
import { IRoleDto } from "@shared/types/dtos/IRoleDto";
import { PermissionDto } from "@shared/types/dtos/PermissionDto";

export class RoleMapper extends BaseMapper<Role> implements IRoleDto {
  id: number;
  name: string;
  permissions: PermissionDto[];

  constructor(data: Role, keys: (keyof Role)[] = ["id", "name"]) {
    super(data, keys);

    if (data.permissionToRole) {
      this.permissions = data.permissionToRole.map(
        ({ enabled, permission }) => ({
          ...permission,
          enabled,
        })
      );
    }

    return this;
  }
}
