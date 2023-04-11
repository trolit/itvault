import { StatusCodes as HTTP } from "http-status-codes";
import { Request, NextFunction, Response } from "express";

import { Di } from "@enums/Di";
import { Permission } from "@enums/Permission";
import { instanceOf } from "@helpers/instanceOf";
import { JWT_TOKEN_COOKIE_KEY } from "@config/index";
import { IAuthService } from "@interfaces/service/IAuthService";
import { isPermissionEnabled } from "@helpers/isPermissionEnabled";
import { IPermissionService } from "@interfaces/service/IPermissionService";

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

    const arePermissionsValid = await verifyUserPermissions(userId, options);

    if (!arePermissionsValid) {
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

  const authService = instanceOf<IAuthService>(Di.AuthService);

  const result = authService.verifyToken(token);

  if (result.error) {
    return null;
  }

  const userId = result.payload.id;

  request.userId = userId;

  return userId;
}

async function verifyUserPermissions(userId: number, options: IOptions) {
  const permissionService = instanceOf<IPermissionService>(
    Di.PermissionService
  );

  const userPermissions = await permissionService.getUserPermissions(userId);

  if (!userPermissions) {
    return false;
  }

  if (
    options.withPermission &&
    !isPermissionEnabled(options.withPermission, userPermissions)
  ) {
    return false;
  }

  if (
    options.withOneOfPermissions &&
    options.withOneOfPermissions.every(
      permission => !isPermissionEnabled(permission, userPermissions)
    )
  ) {
    return false;
  }

  return true;
}
