import { injectable } from "tsyringe";
import { EntityManager, Repository } from "typeorm";

import { Role } from "@entities/Role";
import { User } from "@entities/User";
import { BaseRepository } from "./BaseRepository";
import { UpdateUserDto } from "@dtos/UpdateUserDto";
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
      withDeleted: true,
    });
  }

  updateMany(
    entitiesToUpdate: UpdateUserDto[]
  ): Promise<{ fails: UpdateUserDto[] }> {
    return this.database.manager.transaction(
      async (entityManager: EntityManager) => {
        const fails: UpdateUserDto[] = [];

        for (const entityToUpdate of entitiesToUpdate) {
          const {
            id,
            data: { deletedAt, roleId },
          } = entityToUpdate;

          const partialEntity: Partial<User> = {};

          if (deletedAt) {
            partialEntity.deletedAt = deletedAt;
          }

          if (roleId) {
            const role = await entityManager.findOneBy(Role, { id: roleId });

            if (role) {
              partialEntity.role = role;
            }
          }

          const updateResult = await entityManager.update(
            User,
            { id },
            partialEntity
          );

          if (updateResult.affected) {
            continue;
          }

          fails.push(entityToUpdate);
        }

        return { fails };
      }
    );
  }
}
