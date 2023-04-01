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

  findByEmail(
    email: string,
    options?: { includePermissions: boolean }
  ): Promise<User | null> {
    const permissionsRelation = options?.includePermissions
      ? {
          relations: {
            role: {
              permissionToRole: {
                permission: true,
              },
            },
          },
        }
      : {};

    return this.database.findOne({
      where: {
        email,
      },
      ...permissionsRelation,
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
