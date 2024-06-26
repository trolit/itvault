import { Request } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IAuthService } from "types/services/IAuthService";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { GetSessionsControllerTypes } from "types/controllers/Auth/GetSessionsController";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class GetSessionsController extends BaseController {
  constructor(
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

  static readonly ALL_VERSIONS = [v1];

  async v1(request: Request, response: GetSessionsControllerTypes.v1.Response) {
    const { userId, sessionId } = request;

    const keys = await this._authService.getSessionKeys(userId);

    const sessions = await this._authService.getSessions(sessionId, keys);

    return this.finalizeRequest(response, HTTP.OK, sessions);
  }
}
