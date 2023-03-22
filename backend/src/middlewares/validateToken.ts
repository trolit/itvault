import { container } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { Request, NextFunction, Response } from "express";

import { AuthService } from "@services/Auth";
import { JWT_TOKEN_COOKIE_KEY } from "@config/index";

export const validateToken = (() => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const token = request.cookies[JWT_TOKEN_COOKIE_KEY];

    if (!token) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    const authService = container.resolve(AuthService);

    const result = authService.verifyToken(token);

    if (result.error) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    request.userId = result.payload.id;

    next();
  };
})();
