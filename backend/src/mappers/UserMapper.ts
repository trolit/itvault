import { BaseMapper } from "./BaseMapper";

import { User } from "@entities/User";
import { IUserDto } from "@shared/types/dtos/User";

export class UserMapper extends BaseMapper<User> implements IUserDto {
  id: number;
  email: string;
  fullName: string;
  isSignedUp: boolean;
  roleId: number;
  roleName: string;
  isActive: boolean;
  invitedBy: string | null;

  constructor(data: User) {
    super(data, ["id", "email", "fullName", "isSignedUp"]);

    this.assignInitialKeys();

    const {
      createdBy,
      deletedAt,
      role: { id, name },
    } = data;

    this.roleId = id;
    this.roleName = name;
    this.isActive = deletedAt === null;

    this.invitedBy = createdBy ? createdBy.fullName : null;

    return this;
  }
}
