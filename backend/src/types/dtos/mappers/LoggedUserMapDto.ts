import { User } from "@entities/User";
import { BaseMapDto } from "./BaseMapDto";
import { PermissionDto } from "@dtos/PermissionDto";
import { ILoggedUserDto } from "@shared/types/dtos/ILoggedUserDto";

export class LoggedUserMapDto
  extends BaseMapDto<User>
  implements ILoggedUserDto
{
  id: number;
  email: string;
  fullName: string;
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
