import type { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { CustomRequest } from "@utils/types";
import { JWT_TOKEN_COOKIE_KEY } from "@config/index";
import { IController } from "@interfaces/IController";
import { IAuthService } from "@interfaces/IAuthService";
import { IUserRepository } from "@interfaces/IUserRepository";

@injectable()
export class StatusController implements IController {
  constructor(
    @inject(Di.UserRepository)
    private _userRepository: IUserRepository,
    @inject(Di.AuthService)
    private _authService: IAuthService
  ) {}

  async invoke(request: CustomRequest, response: Response) {
    const { token } = request.cookies;

    if (!token) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    const result = this._authService.verifyToken(token);

    if (result.error) {
      response.clearCookie(JWT_TOKEN_COOKIE_KEY);

      return response.status(HTTP.FORBIDDEN).send();
    }

    const { email } = result.payload;

    const user = await this._userRepository.findByEmail(email);

    if (!user) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    return response.status(HTTP.OK).send();
  }
}
