import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { UpdateManyControllerTypes } from "types/controllers/User/UpdateManyController";

import { Di } from "@enums/Di";
import { Permission } from "@enums/Permission";
import { ControllerImplementation } from "miscellaneous-types";
import { IUserService } from "@interfaces/services/IUserService";

import { isPermissionEnabled } from "@helpers/isPermissionEnabled";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class UpdateManyController extends BaseController {
  constructor(
    @inject(Di.UserService)
    private _userService: IUserService
  ) {
    super();
  }

  implementations: ControllerImplementation[] = [
    {
      version: v1_0,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [v1_0];

  async v1(
    request: UpdateManyControllerTypes.v1.Request,
    response: UpdateManyControllerTypes.v1.Response
  ) {
    const {
      body: { value },
    } = request;

    const result = await this._userService.updateMany(value);

    if (!result.isSuccess) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send(result.error);
    }

    this._userService.reflectChangesInDataStore(value);

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }

  static isMissingPermissions(
    request: UpdateManyControllerTypes.v1.Request
  ): boolean {
    const { permissions, body } = request;

    if (!isPermissionEnabled(Permission.ViewAllUsers, permissions)) {
      return false;
    }

    const isAllowedToRestoreUserAccount = isPermissionEnabled(
      Permission.RestoreUserAccount,
      permissions
    );

    const isAllowedToDeactivateUserAccount = isPermissionEnabled(
      Permission.DeactivateUserAccount,
      permissions
    );

    const isAllowedToChangeUserRole = isPermissionEnabled(
      Permission.ChangeUserRole,
      permissions
    );

    const isActivePropertyCheck = (isActive?: boolean) => {
      if (isActive === undefined) {
        return false;
      }

      return isActive
        ? !isAllowedToRestoreUserAccount
        : !isAllowedToDeactivateUserAccount;
    };

    return body.value.some(
      ({ data }) =>
        isActivePropertyCheck(data.isActive) ||
        (data.roleId && !isAllowedToChangeUserRole)
    );
  }
}
