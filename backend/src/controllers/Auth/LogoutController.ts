import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { JWT_TOKEN_COOKIE_KEY } from "@config";
import { CustomRequest } from "@custom-types/express";
import { IController } from "@interfaces/IController";
import { IAuthService } from "@interfaces/service/IAuthService";

@injectable()
export class LogoutController implements IController {
  constructor(
    @inject(Di.AuthService)
    private _authService: IAuthService
  ) {}

  async invoke(request: CustomRequest, response: Response) {
    const token = request.cookies[JWT_TOKEN_COOKIE_KEY];

    if (!token) {
      return response.status(HTTP.UNAUTHORIZED).send();
    }

    await this._authService.signOut(token, response);

    return response.status(HTTP.OK).send();
  }
}
