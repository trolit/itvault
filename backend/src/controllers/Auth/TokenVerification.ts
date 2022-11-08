import type { Request } from "express";
import { autoInjectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { AuthService } from "@services/Auth";
import { ResponseOfType } from "@utilities/types";
import { IController } from "@interfaces/IController";

@autoInjectable()
export class TokenVerificationController implements IController {
  constructor(private authService?: AuthService) {}

  async invoke(request: Request, response: ResponseOfType<boolean>) {
    if (!this.authService) {
      return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
    }

    const { token } = request.cookies;

    if (!token) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    const isValid = this.authService.isTokenValid(token);

    if (!isValid) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    return response.status(HTTP.OK).send();
  }
}
