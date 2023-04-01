import { container } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { Request, NextFunction, Response } from "express";

import { Di } from "@enums/Di";
import { UserDto } from "@dtos/UserDto";
import { Permission } from "@enums/Permission";
import { JWT_TOKEN_COOKIE_KEY } from "@config/index";
import { IAuthService } from "@interfaces/IAuthService";
import { IDataStoreService } from "@interfaces/IDataStoreService";

interface IOptions {
  withActiveAccount: boolean;
  withPermission?: Permission;
}

export const requireAuthentication = ((
  options = { withActiveAccount: true }
  options: IOptions = {
    withActiveAccount: true,
  }
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

    const isAccountActive = await verifyAccountStatus(request.userId);

    if (!isAccountActive) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    next();
  };
})();

async function verifyAccountStatus(userId: number) {
  const dataStoreService = container.resolve<IDataStoreService>(
    Di.DataStoreService
  );

  const userDetails = await dataStoreService.getKey(userId.toString());

  if (!userDetails) {
    return false;
  }

  const parsedUserDetails = userDetails.asParsed<UserDto>();

  return parsedUserDetails.isActive;
}
