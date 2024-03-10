import { User } from "@db/entities/User";

import { BaseMapper } from "./BaseMapper";

import { ILoggedUserDTO } from "@shared/types/DTOs/Auth";
import { IRolePermissionDTO } from "@shared/types/DTOs/Role";

export class LoggedUserMapper
  extends BaseMapper<User>
  implements ILoggedUserDTO
{
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  roleId: number;
  token?: string;
  roleName: string;
  permissions: IRolePermissionDTO[];

  constructor(data: User) {
    super(data, ["id", "email", "firstName", "lastName", "fullName"]);

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
