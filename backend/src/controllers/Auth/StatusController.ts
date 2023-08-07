import type { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { LoggedUserMapper } from "@mappers/LoggedUserMapper";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { JWT } from "@config";

import { Di } from "@enums/Di";
import { IAuthService } from "@interfaces/services/IAuthService";
import { IUserRepository } from "@interfaces/repositories/IUserRepository";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

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
      version: v1_0,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [v1_0];

  async v1(request: CustomRequest, response: Response) {
    const { [JWT.COOKIE_KEY]: token } = request.cookies;

    if (!token) {
      return response.status(HTTP.UNAUTHORIZED).send();
    }

    const result = this._authService.verifyToken(token);

    if (result.error) {
      response.clearCookie(JWT.COOKIE_KEY);

      return response.status(HTTP.UNAUTHORIZED).send();
    }

    const { email } = result.payload;

    const user = await this._userRepository.findByEmail(email, {
      includePermissions: true,
    });

    if (!user) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    const mappedUserData = this.mapper.map(user, LoggedUserMapper);

    return this.finalizeRequest(response, HTTP.OK, mappedUserData);
  }
}
