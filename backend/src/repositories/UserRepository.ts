import uniq from "lodash/uniq";
import { injectable } from "tsyringe";
import { Result } from "types/Result";
import { In, Repository } from "typeorm";

import { BaseRepository } from "./BaseRepository";

import { Role } from "@entities/Role";
import { User } from "@entities/User";
import { IError } from "@interfaces/IError";
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

  async updateMany(
    entitiesToUpdate: UpdateUserDto[]
  ): Promise<Result<UpdateUserDto[]>> {
    const transaction = await this.useTransaction();

    const roleIds = entitiesToUpdate
      .filter(({ data }) => !!data.roleId)
      .map(({ data }) => data.roleId);

    const uniqueRoleIds = uniq(roleIds);

    const errors: IError[] = [];

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

        missingRoleIds.map(roleId => {
          errors.push({
            messages: [
              `Failed to perform update as role identified by ${roleId} is not available.`,
            ],
          });
        });

        throw new Error();
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

        errors.push({
          messages: [
            `Failed to perform update due to user identified by ${id}.`,
          ],
        });

        throw new Error();
      }

      return Result.success();
    } catch (error) {
      await transaction.rollbackTransaction();

      return Result.failure(errors);
    } finally {
      await transaction.release();
    }
  }
}
