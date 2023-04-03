import { injectable } from "tsyringe";
import { EntityManager, Repository } from "typeorm";

import { User } from "@entities/User";
import { BaseRepository } from "./BaseRepository";
import { IUserRepository } from "@interfaces/IUserRepository";
import { UpdateUserDto } from "@dtos/UpdateUserDto";

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
          const { id, data } = entityToUpdate;

          const updateResult = await entityManager.update(User, { id }, data);

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
