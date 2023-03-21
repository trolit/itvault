import { container } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { Request, NextFunction, Response } from "express";

import { AuthService } from "@services/Auth";
import { JwtPayloadDto } from "@dtos/JwtPayload";

export const validateToken = (() => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const token = request.cookies["token"];

    if (!token) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    const authService = container.resolve(AuthService);

    const isValid = authService.isTokenValid(token);

    if (!isValid) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    const decodedToken = authService.decodeToken(token);

    if (!decodedToken) {
      return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
    }

    const payload = decodedToken.payload as JwtPayloadDto;

    request.userId = payload.id;

    next();
  };
})();
