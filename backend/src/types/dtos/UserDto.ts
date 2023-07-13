import { BaseDto } from "./BaseDto";
import { User } from "@entities/User";
import { PermissionDto } from "./PermissionDto";

export class UserDto extends BaseDto<User> {
  roleId: number;
  roleName: string;
  permissions: PermissionDto[];

  constructor(data: User, keys: (keyof User)[] = ["id", "email", "fullName"]) {
    super(data, keys);

    const {
      role: { id, name, permissionToRole },
    } = data;

    this.roleId = id;
    this.roleName = name;
    this.permissions = permissionToRole.map(({ enabled, permission }) => ({
      ...permission,
      enabled,
    }));

    return this;
  }
}
