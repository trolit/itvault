import { In } from "typeorm";
import { injectable } from "tsyringe";
import { IUserRepository } from "types/repositories/IUserRepository";

import { BaseRepository } from "./BaseRepository";

import { User } from "@entities/User";
import { Permission } from "@shared/types/enums/Permission";

@injectable()
export class UserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
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

  filterUsersWithAccessToWorkspace(
    workspaceId: number,
    userIds: number[]
  ): Promise<User[]> {
    return this.database.find({
      where: [
        {
          userToWorkspace: {
            userId: In(userIds),
            workspaceId,
          },
        },
        {
          role: {
            permissionToRole: {
              permission: {
                signature: Permission.ViewAllWorkspaces,
              },
              enabled: true,
            },
          },
        },
      ],
    });
  }
}
