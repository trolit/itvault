import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IAuthService } from "types/services/IAuthService";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { JWT } from "@config";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class SignOutController extends BaseController {
  constructor(
    @inject(Di.AuthService)
    private _authService: IAuthService
  ) {
    super();
  }

  static ALL_VERSIONS = [v1];

  implementations: ControllerImplementation[] = [
    {
      version: v1,
      handle: this.v1.bind(this),
    },
  ];

  async v1(request: CustomRequest, response: Response) {
    const token = request.cookies[JWT.COOKIE_KEY];

    if (!token) {
      return response.status(HTTP.UNAUTHORIZED).send();
    }

    await this._authService.signOut(token, response);

    return this.finalizeRequest(response, HTTP.OK);
  }
}
