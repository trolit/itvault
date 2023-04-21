import { Response } from "express";
import { injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";

import { JWT_TOKEN_COOKIE_KEY } from "@config";
import { CustomRequest } from "@utils/types";
import { IController } from "@interfaces/IController";

@injectable()
export class LogoutController implements IController {
  async invoke(request: CustomRequest, response: Response) {
    const token = request.cookies[JWT_TOKEN_COOKIE_KEY];

    if (!token) {
      return response.status(HTTP.UNAUTHORIZED).send();
    }

    response.clearCookie(JWT_TOKEN_COOKIE_KEY);

    return response.status(HTTP.OK).send();
  }
}
