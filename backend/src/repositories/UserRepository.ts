import { Repository } from "typeorm";
import { injectable } from "tsyringe";
import { IUserRepository } from "types/repositories/IUserRepository";

import { BaseRepository } from "./BaseRepository";

import { User } from "@entities/User";

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
      select: {
        id: true,
        email: true,
        password: true,
        fullName: true,
      },
      where: {
        email,
        isSignedUp: true,
      },
      ...permissionsRelation,
    });
  }
}
