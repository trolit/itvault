import { inject, injectable } from "tsyringe";

import { Di } from "@enums/Di";
import { Permission } from "@enums/Permission";
import { IDataStoreService } from "@interfaces/IDataStoreService";
import { isPermissionEnabled } from "@helpers/isPermissionEnabled";
import { IPermissionService } from "@interfaces/IPermissionService";

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
    const data = await this._dataStoreService.getUserData(userId);

    if (!data) {
      return false;
    }

    const [, role] = data;

    return isPermissionEnabled(permission, role.permissions);
  }
}
