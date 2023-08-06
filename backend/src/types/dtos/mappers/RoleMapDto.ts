import { Role } from "@entities/Role";
import { BaseMapDto } from "./BaseMapDto";
import { IRoleDto } from "@shared/types/dtos/IRoleDto";
import { PermissionDto } from "@shared/types/dtos/PermissionDto";

export class RoleMapDto extends BaseMapDto<Role> implements IRoleDto {
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
