import { injectable } from "tsyringe";
import { EntityManager, Repository } from "typeorm";

import { Role } from "@entities/Role";
import { User } from "@entities/User";
import { Result } from "@utils/Result";
import { IError } from "@interfaces/IError";
import { Permission } from "@enums/Permission";
import { BaseRepository } from "./BaseRepository";
import { RequestPermissions } from "@utils/types";
import { UpdateUserDto } from "@dtos/UpdateUserDto";
import { IUserRepository } from "@interfaces/repository/IUserRepository";

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
      withDeleted: true,
    });
  }

  async updateMany(
    entitiesToUpdate: UpdateUserDto[]
  ): Promise<Result<UpdateUserDto[]>> {
    const transactionResult = await this.database.manager.transaction(
      async (entityManager: EntityManager) => {
        const errors: IError[] = [];

        const uniqueRoleIds = entitiesToUpdate
          .filter(({ data }) => !!data.roleId)
          .map(({ data }) => data.roleId);

        const promises: Promise<Role>[] = uniqueRoleIds.map(roleId => {
          return new Promise((resolve, reject) => {
            const role = entityManager.findOneBy(Role, { id: roleId });

            if (role) {
              return resolve(<Promise<Role>>role);
            }

            return reject();
          });
        });

        const roles = await Promise.all(promises);

        for (const entityToUpdate of entitiesToUpdate) {
          const {
            id,
            data: { isActive, roleId },
          } = entityToUpdate;

          const partialEntity: Partial<User> = {};

          if (isActive !== undefined) {
            partialEntity.deletedAt = isActive ? null : new Date();
          }

          if (roleId) {
            const role = roles.find(role => role.id === roleId);

            partialEntity.role = role;
          }

          const updateResult = await entityManager.update(
            User,
            { id },
            partialEntity
          );

          if (updateResult.affected) {
            continue;
          }

          errors.push({
            key: id,
            messages: [
              "There was a problem while attempting to update that account.",
            ],
          });
        }

        return { errors };
      }
    );

    return transactionResult.errors.length
      ? Result.failure(transactionResult.errors)
      : Result.success([]);
  }
}
