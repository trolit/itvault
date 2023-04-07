import { inject, injectable } from "tsyringe";

import { Di } from "@enums/Di";
import { Permission } from "@enums/Permission";
import { DataStoreRole } from "@utils/DataStoreRole";
import { DataStoreUser } from "@utils/DataStoreUser";
import { DataStoreKeyType } from "@enums/DataStoreKeyType";
import { isPermissionEnabled } from "@helpers/isPermissionEnabled";
import { IDataStoreService } from "@interfaces/service/IDataStoreService";
import { IPermissionService } from "@interfaces/service/IPermissionService";

@injectable()
export class PermissionService implements IPermissionService {
  constructor(
    @inject(Di.DataStoreService)
    private _dataStoreService: IDataStoreService
  ) {}

  async hasPermission(
    userId: number,
    permission: Permission
  ): Promise<boolean> {
    const userData = await this._dataStoreService.get<DataStoreUser>(
      userId,
      DataStoreKeyType.AuthenticatedUser
    );

    if (!userData) {
      return false;
    }

    const roleData = await this._dataStoreService.get<DataStoreRole>(
      userData.roleId,
      DataStoreKeyType.Role
    );

    if (!roleData) {
      return false;
    }

    return isPermissionEnabled(permission, roleData.permissions);
  }
}
