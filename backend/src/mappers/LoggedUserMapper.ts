import { BaseMapper } from "./BaseMapper";

import { User } from "@entities/User";
import { ILoggedUserDto } from "@shared/types/dtos/ILoggedUserDto";
import { IRolePermissionDto } from "@shared/types/dtos/IRolePermissionDto";

export class LoggedUserMapper
  extends BaseMapper<User>
  implements ILoggedUserDto
{
  id: number;
  email: string;
  fullName: string;
  roleId: number;
  roleName: string;
  permissions: IRolePermissionDto[];

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
