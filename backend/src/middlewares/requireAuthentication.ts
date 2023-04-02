import { container } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { Request, NextFunction, Response } from "express";

import { Di } from "@enums/Di";
import { UserDto } from "@dtos/UserDto";
import { Permission } from "@enums/Permission";
import { JWT_TOKEN_COOKIE_KEY } from "@config/index";
import { IAuthService } from "@interfaces/IAuthService";
import { DataStoreKeyType } from "@enums/DataStoreKeyType";
import { IDataStoreService } from "@interfaces/IDataStoreService";
import { isPermissionEnabled } from "@helpers/isPermissionEnabled";

interface IOptions {
  withActiveAccount: boolean;
  withPermission?: Permission;
}

export const requireAuthentication = (
  options: IOptions = {
    withActiveAccount: true,
  }
) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const userId = handleTokenFromRequest(request);

    if (!userId) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    const areOptionsRequirementsValid = await verifyOptionsRelatedToDataStore(
      userId.toString(),
      options
    );

    if (!areOptionsRequirementsValid) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    next();
  };
};

function handleTokenFromRequest(request: Request) {
  const token = request.cookies[JWT_TOKEN_COOKIE_KEY];

  if (!token) {
    return null;
  }

  const authService = container.resolve<IAuthService>(Di.AuthService);

  const result = authService.verifyToken(token);

  if (result.error) {
    return null;
  }

  const userId = result.payload.id;

  request.userId = userId;

  return userId;
}

async function verifyOptionsRelatedToDataStore(
  userId: string,
  options: IOptions
) {
  const dataStoreService = container.resolve<IDataStoreService>(
    Di.DataStoreService
  );

  const userDetails = await dataStoreService.getKey<UserDto>(
    userId,
    DataStoreKeyType.AuthenticatedUser
  );

  if (!userDetails) {
    return false;
  }

  if (options.withActiveAccount && !userDetails.isActive) {
    return false;
  }

  if (
    options.withPermission &&
    !isPermissionEnabled(options.withPermission, userDetails.permissions)
  ) {
    return false;
  }

  return true;
}
