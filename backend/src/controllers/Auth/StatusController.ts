import type { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { JWT } from "@config";

import { Di } from "@enums/Di";
import { ControllerImplementation } from "miscellaneous-types";
import { IAuthService } from "@interfaces/services/IAuthService";
import { IUserRepository } from "@interfaces/repositories/IUserRepository";

import { BaseController } from "@controllers/BaseController";

const version1 = 1;

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
      version: version1,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [version1];

  async v1(request: CustomRequest, response: Response) {
    const { token } = request.cookies;

    if (!token) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    const result = this._authService.verifyToken(token);

    if (result.error) {
      response.clearCookie(JWT.COOKIE_KEY);

      return response.status(HTTP.FORBIDDEN).send();
    }

    const { email } = result.payload;

    const user = await this._userRepository.findByEmail(email);

    if (!user) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    return this.finalizeRequest(response, HTTP.OK);
  }
}
