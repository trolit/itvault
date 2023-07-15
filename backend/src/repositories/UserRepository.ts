import uniq from "lodash/uniq";
import { injectable } from "tsyringe";
import { In, Repository } from "typeorm";

import { BaseRepository } from "./BaseRepository";

import { Role } from "@entities/Role";
import { User } from "@entities/User";
import { UpdateUserDto } from "@dtos/UpdateUserDto";
import { IUserRepository } from "@interfaces/repositories/IUserRepository";

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
      },
      ...permissionsRelation,
    });
  }

  async updateMany(entitiesToUpdate: UpdateUserDto[]): Promise<boolean> {
    const transaction = await this.useTransaction();

    const roleIds = entitiesToUpdate
      .filter(({ data }) => !!data.roleId)
      .map(({ data }) => data.roleId);

    const uniqueRoleIds = uniq(roleIds);

    try {
      const roles = await transaction.manager.find(Role, {
        where: {
          id: In(uniqueRoleIds),
        },
      });

      if (roles.length !== uniqueRoleIds.length) {
        const missingRoleIds = uniqueRoleIds.filter(uniqueRoleId =>
          roles.every(role => role.id !== uniqueRoleId)
        );

        throw new Error(
          `Failed to perform update due role(s) identified by: ${missingRoleIds.join(
            ", "
          )}`
        );
      }

      for (const entityToUpdate of entitiesToUpdate) {
        const {
          id,
          data: { isActive, roleId },
        } = entityToUpdate;

        const userData: Partial<User> = transaction.manager.create(User, {
          deletedAt: isActive ? null : new Date(),
        });

        if (roleId) {
          userData.role = roles.find(role => role.id === roleId);
        }

        const updateResult = await transaction.manager.update(
          User,
          { id },
          userData
        );

        if (updateResult.affected) {
          continue;
        }

        throw new Error(
          `Failed to perform update due to user identified by ${id}.`
        );
      }

      return true;
    } catch (error) {
      console.log(error);

      await transaction.rollbackTransaction();

      return false;
    } finally {
      await transaction.release();
    }
  }
}
