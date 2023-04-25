import { Di } from "@enums/Di";
import { inject, injectable } from "tsyringe";

import { UpdateUserDto } from "@dtos/UpdateUserDto";
import { DataStoreUser } from "@utils/DataStoreUser";
import { DataStoreKeyType } from "@enums/DataStoreKeyType";
import { IUserService } from "@interfaces/service/IUserService";
import { IDataStoreService } from "@interfaces/service/IDataStoreService";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(Di.DataStoreService)
    private _dataStoreService: IDataStoreService
  ) {}

  async reflectUpdateManyRequestInDataStore(
    entitiesToUpdate: UpdateUserDto[]
  ): Promise<void> {
    for (const entityToUpdate of entitiesToUpdate) {
      const { id, data } = entityToUpdate;

      const key: [string | number, DataStoreKeyType] = [
        id,
        DataStoreKeyType.AuthenticatedUser,
      ];

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
