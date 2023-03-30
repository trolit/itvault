import { Repository } from "typeorm";
import { injectable } from "tsyringe";

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
      },
      relations: {
        role: {
          permissionToRole: {
            permission: true,
          },
        },
      },
    });
  }

  getAll(take: number, skip: number): Promise<[User[], number]> {
    return this.database.findAndCount({
      take,
      skip,
      order: {
        email: "asc",
      },
      relations: {
        role: true,
      },
    });
  }
}
