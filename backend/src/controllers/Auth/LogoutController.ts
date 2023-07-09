import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { JWT } from "@config";

import { Di } from "@enums/Di";
import { ControllerImplementation } from "miscellaneous-types";
import { IAuthService } from "@interfaces/services/IAuthService";

import { BaseController } from "@controllers/BaseController";

const version1 = 1;

@injectable()
export class LogoutController extends BaseController {
  constructor(
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
    const token = request.cookies[JWT.COOKIE_KEY];

    if (!token) {
      return response.status(HTTP.UNAUTHORIZED).send();
    }

    await this._authService.signOut(token, response);

    return this.finalizeRequest(response, HTTP.OK);
  }
}
