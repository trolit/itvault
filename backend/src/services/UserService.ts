import { Di } from "types/enums/Di";
import { inject, injectable } from "tsyringe";

import {
  DataStoreKey,
  DataStoreUser,
  DataStoreKeyType,
} from "@custom-types/data-store";
import { UpdateUserDto } from "@dtos/UpdateUserDto";
import { IUserService } from "types/interfaces/service/IUserService";
import { IDataStoreService } from "types/interfaces/service/IDataStoreService";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(Di.DataStoreService)
    private _dataStoreService: IDataStoreService
  ) {}

  async reflectUpdateManyInDataStore(
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
}
