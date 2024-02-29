import type { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IAuthService } from "types/services/IAuthService";
import { LoggedUserMapper } from "@mappers/LoggedUserMapper";
import { IUserRepository } from "types/repositories/IUserRepository";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class StatusController extends BaseController {
  constructor(
    @inject(Di.UserRepository)
    private _userRepository: IUserRepository,
    @inject(Di.AuthService)
    private _authService: IAuthService
  ) {
    super();
  }

  implementations: ControllerImplementation[] = [
    {
      version: v1,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [v1];

  async v1(request: CustomRequest, response: Response) {
    const { userId } = request;

    const user = await this._userRepository.getOne({
      where: {
        id: userId,
      },
      relations: {
        role: {
          permissionToRole: {
            permission: true,
          },
        },
      },
    });

    if (!user) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    const mappedUserData = this.mapper.map(user).to(LoggedUserMapper);

    return this.finalizeRequest(response, HTTP.OK, mappedUserData);
  }
}
