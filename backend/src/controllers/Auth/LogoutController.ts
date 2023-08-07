import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { JWT } from "@config";

import { Di } from "@enums/Di";
import { IAuthService } from "@interfaces/services/IAuthService";

import { BaseController } from "@controllers/BaseController";

const { v1_0 } = BaseController.ALL_VERSION_DEFINITIONS;

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
      version: v1_0,
      handle: this.v1.bind(this),
    },
  ];

  static ALL_VERSIONS = [v1_0];

  async v1(request: CustomRequest, response: Response) {
    const token = request.cookies[JWT.COOKIE_KEY];

    if (!token) {
      return response.status(HTTP.UNAUTHORIZED).send();
    }

    await this._authService.signOut(token, response);

    return this.finalizeRequest(response, HTTP.OK);
  }
}
