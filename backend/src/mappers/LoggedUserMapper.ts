import { BaseMapper } from "./BaseMapper";

import { User } from "@entities/User";
import { ILoggedUserDTO } from "@shared/types/DTOs/User";
import { IRolePermissionDTO } from "@shared/types/DTOs/Role";

export class LoggedUserMapper
  extends BaseMapper<User>
  implements ILoggedUserDTO
{
  id: number;
  email: string;
  fullName: string;
  roleId: number;
  roleName: string;
  permissions: IRolePermissionDTO[];

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
