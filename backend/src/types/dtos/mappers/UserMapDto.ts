import { User } from "@entities/User";
import { BaseMapDto } from "./BaseMapDto";
import { IUserDto } from "@shared/types/dtos/IUserDto";

export class UserMapDto extends BaseMapDto<User> implements IUserDto {
  id: number;
  email: string;
  fullName: string;
  isSignedUp: boolean;
  roleId: number;
  roleName: string;
  isActive: boolean;
  invitedBy: string | null;

  constructor(
    data: User,
    keys: (keyof User)[] = ["id", "email", "fullName", "isSignedUp"]
  ) {
    super(data, keys);

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
