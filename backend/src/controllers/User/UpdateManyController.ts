import { Request } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Result } from "@utils/Result";
import { Permission } from "@enums/Permission";
import { UpdateUserDto } from "@dtos/UpdateUserDto";
import { IController } from "@interfaces/IController";
import { CustomRequest, CustomResponse } from "@utils/types";
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
    private _userRepository: IUserRepository
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

    // @TODO redis

    return response.status(HTTP.NO_CONTENT).send();
  }

  static permissionsHandler(request: Request): boolean {
    const { permissions, body } = request;

    if (!isPermissionEnabled(Permission.ViewAllUsers, permissions)) {
      return false;
    }

    const castedBody = <IRequestBody>body;

    return castedBody.value.some(
      ({ data }) =>
        (data.isActive &&
          !isPermissionEnabled(Permission.RestoreUserAccount, permissions)) ||
        (!data.isActive &&
          !isPermissionEnabled(
            Permission.DeactivateUserAccount,
            permissions
          )) ||
        (data.roleId &&
          !isPermissionEnabled(Permission.ChangeUserRole, permissions))
    );
  }
}
