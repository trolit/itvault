import { container } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { Request, NextFunction, Response } from "express";

import { Di } from "@enums/Di";
import { UserDto } from "@dtos/UserDto";
import { Permission } from "@enums/Permission";
import { JWT_TOKEN_COOKIE_KEY } from "@config/index";
import { DataStoreKeyType } from "@enums/DataStoreKeyType";
import { IAuthService } from "@interfaces/service/IAuthService";
import { isPermissionEnabled } from "@helpers/isPermissionEnabled";
import { IDataStoreService } from "@interfaces/service/IDataStoreService";

interface IOptions {
  withPermission?: Permission;

  withOneOfPermissions?: Permission[];
}

export const requireAuthentication = (options?: IOptions) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const userId = handleTokenFromRequest(request);

    if (!userId) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    if (!options) {
      return next();
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

  const userDetails = await dataStoreService.get<UserDto>(
    userId,
    DataStoreKeyType.AuthenticatedUser
  );

  if (!userDetails) {
    return false;
  }

  if (
    options.withPermission &&
    !isPermissionEnabled(options.withPermission, userDetails.permissions)
  ) {
    return false;
  }

  if (
    options.withOneOfPermissions &&
    options.withOneOfPermissions.every(
      permission => !isPermissionEnabled(permission, userDetails.permissions)
    )
  ) {
    return false;
  }

  return true;
}
