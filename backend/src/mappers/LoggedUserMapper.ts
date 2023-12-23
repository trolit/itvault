import { BaseMapper } from "./BaseMapper";

import { User } from "@entities/User";
import { IRolePermissionDto } from "@shared/types/dtos/Role";
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
  permissions: IRolePermissionDto[];

  constructor(data: User) {
    super(data, ["id", "email", "fullName"]);

    this.assignInitialKeys();

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
