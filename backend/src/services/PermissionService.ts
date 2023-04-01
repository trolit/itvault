import { inject, injectable } from "tsyringe";

import { Di } from "@enums/Di";
import { UserDto } from "@dtos/UserDto";
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
    const userDetails = await this._dataStoreService.getKey(userId.toString());

    if (!userDetails) {
      return false;
    }

    const { permissions } = userDetails.asParsed<UserDto>();

    return isPermissionEnabled(permission, permissions);
  }
}
