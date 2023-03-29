import { container } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { Request, NextFunction, Response } from "express";

import { Di } from "@enums/Di";
import { UserDto } from "@dtos/UserDto";
import { JWT_TOKEN_COOKIE_KEY } from "@config/index";
import { IAuthService } from "@interfaces/IAuthService";
import { IRedisService } from "@interfaces/IRedisService";

export const requireAuthentication = ((
  options = { withActiveAccount: true }
) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const token = request.cookies[JWT_TOKEN_COOKIE_KEY];

    if (!token) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    const authService = container.resolve<IAuthService>(Di.AuthService);

    const result = authService.verifyToken(token);

    if (result.error) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    request.userId = result.payload.id;

    if (!options.withActiveAccount) {
      next();
    }

    const isAccountActive = await requireActiveAccount(request.userId);

    if (!isAccountActive) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    next();
  };
})();

async function requireActiveAccount(userId: number) {
  const redisService = container.resolve<IRedisService>(Di.RedisService);

  const userDetails = await redisService.getKey(userId.toString());

  if (!userDetails) {
    return false;
  }

  const parsedUserDetails = userDetails.asParsed<UserDto>();

  return parsedUserDetails.isActive;
}
