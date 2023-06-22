import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { JWT } from "@config";
import { Di } from "types/enums/Di";
import { CustomRequest } from "@custom-types/express";
import { IController } from "types/interfaces/IController";
import { IAuthService } from "types/interfaces/service/IAuthService";

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
