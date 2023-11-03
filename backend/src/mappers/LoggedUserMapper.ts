import { BaseMapper } from "./BaseMapper";

import { User } from "@entities/User";
import { IPermissionDto } from "@shared/types/dtos/IPermissionDto";
import { ILoggedUserDto } from "@shared/types/dtos/ILoggedUserDto";

export class LoggedUserMapper
  extends BaseMapper<User>
  implements ILoggedUserDto
{
  id: number;
  email: string;
  fullName: string;
  roleId: number;
  roleName: string;
  permissions: IPermissionDto[];

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
