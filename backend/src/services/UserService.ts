import { In } from "typeorm";
import { inject, injectable } from "tsyringe";
import {
  DataStoreKey,
  DataStoreUser,
  DataStoreKeyType,
} from "data-store-types";

import { Di } from "@enums/Di";
import { User } from "@entities/User";
import { Role } from "@entities/Role";
import { UpdateUserDto } from "@dtos/UpdateUserDto";
import { IUserService } from "@interfaces/services/IUserService";
import { IUserRepository } from "@interfaces/repositories/IUserRepository";
import { IDataStoreService } from "@interfaces/services/IDataStoreService";

import { getUniqueValuesFromCollection } from "@helpers/getUniqueValuesFromCollection";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(Di.UserRepository)
    private _userRepository: IUserRepository,
    @inject(Di.DataStoreService)
    private _dataStoreService: IDataStoreService
  ) {}

  async reflectChangesInDataStore(
    entitiesToUpdate: UpdateUserDto[]
  ): Promise<void> {
    for (const entityToUpdate of entitiesToUpdate) {
      const { id, data } = entityToUpdate;

      const key: DataStoreKey = [id, DataStoreKeyType.AuthenticatedUser];

      if (data.isActive !== undefined && !data.isActive) {
        this._dataStoreService.deleteHash(key);

        continue;
      }

      if (data.roleId) {
        this._dataStoreService.updateHashField<DataStoreUser>(
          key,
          "roleId",
          data.roleId.toString()
        );
      }
    }
  }

  async updateMany(usersToUpdate: UpdateUserDto[]): Promise<string | null> {
    const transaction = await this._userRepository.useTransaction();
    const { manager } = transaction;

    const uniqueRoleIds = getUniqueValuesFromCollection<UpdateUserDto, number>(
      usersToUpdate,
      "data.roleId"
    );

    try {
      const roles = await manager.find(Role, {
        where: {
          id: In(uniqueRoleIds),
        },
      });

      if (roles.length !== uniqueRoleIds.length) {
        throw new Error(
          `Not all roles are available. Found only: ${roles
            .map(role => role.name)
            .join(", ")}`
        );
      }

      const entities = usersToUpdate.map(
        ({ id, data: { isActive, roleId } }) => {
          const userData: Partial<User> = manager.create(User, {
            id,
            deletedAt: isActive ? null : new Date(),
          });

          if (roleId) {
            userData.role = roles.find(role => role.id === roleId);
          }

          return userData;
        }
      );

      await manager.save(User, entities);

      await transaction.commitTransaction();

      return null;
    } catch (error) {
      console.log(error);

      await transaction.rollbackTransaction();

      return <string>error;
    } finally {
      await transaction.release();
    }
  }
}
