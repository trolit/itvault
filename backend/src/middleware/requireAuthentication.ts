import { StatusCodes as HTTP } from "http-status-codes";
import { Request, NextFunction, Response } from "express";

import { Di } from "@enums/Di";
import { Permission } from "@enums/Permission";
import { instanceOf } from "@helpers/instanceOf";
import { JWT_TOKEN_COOKIE_KEY } from "@config/index";
import { ALL_PERMISSIONS } from "@config/permissions";
import { DataStorePermission } from "@utils/DataStoreRole";
import { IAuthService } from "@interfaces/service/IAuthService";
import { isPermissionEnabled } from "@helpers/isPermissionEnabled";

interface IOptions {
  withPermission?: Permission;

  withOneOfPermissions?: Permission[];
}

export const requireAuthentication = (options?: IOptions) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const authService = instanceOf<IAuthService>(Di.AuthService);

    const userId = handleTokenFromRequest(request, authService);

    if (!userId) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    const userData = await authService.getUserData(userId);

    if (!userData) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    const [account, role] = userData;

    if (!account.isActive) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    const requestPermissions: Partial<{ [key in Permission]: boolean }> = {};

    ALL_PERMISSIONS.map(permissionDefinition => {
      const rolePermission = role.permissions.find(
        ({ id }) => id === permissionDefinition.id
      );

      requestPermissions[permissionDefinition.id] = rolePermission
        ? rolePermission.enabled
        : false;
    });

    request.permissions = requestPermissions;

    if (!options) {
      return next();
    }

    const arePermissionsValid = validatePermissions(options, role.permissions);

    if (!arePermissionsValid) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    next();
  };
};

function handleTokenFromRequest(request: Request, authService: IAuthService) {
  const token = request.cookies[JWT_TOKEN_COOKIE_KEY];

  if (!token) {
    return null;
  }

  const result = authService.verifyToken(token);

  if (result.error) {
    return null;
  }

  const userId = result.payload.id;

  request.userId = userId;

  return userId;
}

function validatePermissions(
  options: IOptions,
  permissions: DataStorePermission[]
) {
  if (
    options.withPermission &&
    !isPermissionEnabled(options.withPermission, permissions)
  ) {
    return false;
  }

  if (
    options.withOneOfPermissions &&
    options.withOneOfPermissions.every(
      permission => !isPermissionEnabled(permission, permissions)
    )
  ) {
    return false;
  }

  return true;
}
