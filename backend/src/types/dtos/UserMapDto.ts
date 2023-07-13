import { User } from "@entities/User";
import { BaseMapDto } from "./BaseMapDto";

export class UserMapDto extends BaseMapDto<User> {
  roleId: number;
  roleName: string;
  isActive: boolean;

  constructor(data: User, keys: (keyof User)[] = ["id", "email", "fullName"]) {
    super(data, keys);

    const {
      deletedAt,
      role: { id, name },
    } = data;

    this.roleId = id;
    this.roleName = name;
    this.isActive = deletedAt === null;

    return this;
  }
}
