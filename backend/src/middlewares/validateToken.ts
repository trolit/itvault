import { container } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { Request, NextFunction, Response } from "express";

import { AuthService } from "@services/Auth";

export const validateToken = (() => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const token = request.cookies["token"];

    if (!token) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    const authService = container.resolve(AuthService);

    const result = authService.verifyToken(token);

    if (result.error) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    if (!result.content) {
      return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
    }

    request.userId = result.content.id;

    next();
  };
})();
