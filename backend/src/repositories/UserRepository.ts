import { injectable } from "tsyringe";
import { IsNull, Repository } from "typeorm";

import { User } from "@entities/User";
import { BaseRepository } from "./BaseRepository";
import { IUserRepository } from "@interfaces/IUserRepository";

@injectable()
export class UserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  protected database: Repository<User>;

  constructor() {
    super(User);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.database.findOne({
      where: {
        email,
        deletedAt: IsNull(),
      },
      relations: {
        role: {
          permissionToRole: true,
        },
      },
    });
  }
}
