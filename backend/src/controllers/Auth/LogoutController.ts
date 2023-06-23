import { JWT } from "@config";
import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { CustomRequest } from "@custom-types/express";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { IController } from "@interfaces/IController";
import { IAuthService } from "@interfaces/services/IAuthService";

@injectable()
export class LogoutController implements IController {
  constructor(
    @inject(Di.AuthService)
    private _authService: IAuthService
  ) {}

  async invoke(request: CustomRequest, response: Response) {
    const token = request.cookies[JWT.COOKIE_KEY];

    if (!token) {
      return response.status(HTTP.UNAUTHORIZED).send();
    }

    await this._authService.signOut(token, response);

    return response.status(HTTP.OK).send();
  }
}
