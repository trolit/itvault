import { Request } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Permission } from "@enums/Permission";
import { UpdateUserDto } from "@dtos/UpdateUserDto";
import { ControllerImplementation } from "miscellaneous-types";
import { IUserService } from "@interfaces/services/IUserService";
import { IUserRepository } from "@interfaces/repositories/IUserRepository";

import { isPermissionEnabled } from "@helpers/isPermissionEnabled";

import { BaseController } from "@controllers/BaseController";

interface IRequestBody {
  value: UpdateUserDto[];
}

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class UpdateManyController extends BaseController {
  constructor(
    @inject(Di.UserRepository)
    private _userRepository: IUserRepository,
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
    request: CustomRequest<undefined, IRequestBody>,
    response: CustomResponse<UpdateUserDto[] | string>
  ) {
    const {
      body: { value },
    } = request;

    const error = await this._userService.updateMany(value);

    if (error) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send(error);
    }

    this._userService.reflectChangesInDataStore(value);

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }

  static isMissingPermissions(request: Request): boolean {
    const { permissions, body } = request;

    if (!isPermissionEnabled(Permission.ViewAllUsers, permissions)) {
      return false;
    }

    const castedBody = <IRequestBody>body;

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

    return castedBody.value.some(
      ({ data }) =>
        isActivePropertyCheck(data.isActive) ||
        (data.roleId && !isAllowedToChangeUserRole)
    );
  }
}
