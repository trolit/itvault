import { Request } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Result } from "@utils/Result";
import { Permission } from "@enums/Permission";
import { UpdateUserDto } from "@dtos/UpdateUserDto";
import { IController } from "@interfaces/IController";
import { CustomRequest, CustomResponse } from "@utils/types";
import { IUserService } from "@interfaces/service/IUserService";
import { isPermissionEnabled } from "@helpers/isPermissionEnabled";
import { IUserRepository } from "@interfaces/repository/IUserRepository";

interface IRequestBody {
  value: UpdateUserDto[];
}

@injectable()
export class UpdateManyController
  implements
    IController<undefined, IRequestBody, undefined, Result<UpdateUserDto[]>>
{
  constructor(
    @inject(Di.UserRepository)
    private _userRepository: IUserRepository,
    @inject(Di.UserService)
    private _userService: IUserService
  ) {}

  async invoke(
    request: CustomRequest<undefined, IRequestBody>,
    response: CustomResponse<Result<UpdateUserDto[]>>
  ) {
    const {
      body: { value },
    } = request;

    const result = await this._userRepository.updateMany(value);

    if (!result.success) {
      return response.status(HTTP.BAD_REQUEST).send(result);
    }

    this._userService.reflectUpdateManyInDataStore(value);

    return response.status(HTTP.NO_CONTENT).send();
  }

  static hasMissingPermissions(request: Request): boolean {
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

    return castedBody.value.some(
      ({ data }) =>
        (data.isActive && !isAllowedToRestoreUserAccount) ||
        (!data.isActive && !isAllowedToDeactivateUserAccount) ||
        (data.roleId && !isAllowedToChangeUserRole)
    );
  }
}
