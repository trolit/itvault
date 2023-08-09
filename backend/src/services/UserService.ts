import assert from "assert";
import { In } from "typeorm";
import { inject, injectable } from "tsyringe";
import { IUserService } from "types/services/IUserService";
import { TransactionResult } from "types/TransactionResult";
import { IDataStoreService } from "types/services/IDataStoreService";
import { IUserRepository } from "types/repositories/IUserRepository";
import { TransactionError } from "types/custom-errors/TransactionError";
import {
  DataStoreKey,
  DataStoreUser,
  DataStoreKeyType,
} from "data-store-types";

import { Di } from "@enums/Di";
import { User } from "@entities/User";
import { Role } from "@entities/Role";
import { UpdateUserDto } from "@shared/types/dtos/UpdateUserDto";

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

  async updateMany(
    usersToUpdate: UpdateUserDto[]
  ): Promise<TransactionResult<User[]>> {
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
        throw new TransactionError(
          `Not all roles are available to perform operation.`
        );
      }

      const entities = usersToUpdate.map(
        ({ id, data: { isActive, roleId } }) => {
          const userData: User = manager.create(User, {
            id,
            deletedAt: isActive ? null : new Date(),
          });

          if (roleId) {
            const role = roles.find(role => role.id === roleId);
            assert(role);

            userData.role = role;
          }

          return userData;
        }
      );

      const users = await manager.save(User, entities);

      await transaction.commitTransaction();

      return TransactionResult.success(users);
    } catch (error) {
      console.log(error);

      await transaction.rollbackTransaction();

      return TransactionResult.failure(
        error instanceof TransactionError ? error.message : undefined
      );
    } finally {
      await transaction.release();
    }
  }
}
