import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IAuthService } from "types/services/IAuthService";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { DeleteSessionControllerTypes } from "types/controllers/Auth/DeleteSessionController";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class DeleteSessionController extends BaseController {
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

  static ALL_VERSIONS = [v1];

  async v1(
    request: DeleteSessionControllerTypes.v1.Request,
    response: Response
  ) {
    const {
      userId,
      params: { id: sessionId },
    } = request;

    await this._authService.deleteSession(userId, sessionId);

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
