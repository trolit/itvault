import { User } from "@entities/User";
import { BaseMapDto } from "./BaseMapDto";

export class UserMapDto extends BaseMapDto<User> {
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
