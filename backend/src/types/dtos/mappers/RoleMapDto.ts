import { Role } from "@entities/Role";
import { BaseMapDto } from "./BaseMapDto";
import { PermissionDto } from "../PermissionDto";

export class RoleMapDto extends BaseMapDto<Role> {
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
