import { StatusCodes as HTTP } from "http-status-codes";
import { Request, NextFunction, Response } from "express";

import { Di } from "@enums/Di";
import { Permission } from "@enums/Permission";
import { JWT_TOKEN_COOKIE_KEY } from "@config/index";
import { ALL_PERMISSIONS } from "@config/permissions";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { DataStorePermission } from "@utils/DataStoreRole";
import { IAuthService } from "@interfaces/service/IAuthService";

export const requireAuthentication = (() => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const authService = getInstanceOf<IAuthService>(Di.AuthService);

    const userId = processTokenFromRequest(request, authService);

    if (!userId) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    const role = await authService.getSignedUserRole(userId);

    if (!role) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    assignPermissionsToRequest(request, role.permissions);

    next();
  };
})();

function processTokenFromRequest(request: Request, authService: IAuthService) {
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

function assignPermissionsToRequest(
  request: Request,
  rolePermissions: DataStorePermission[]
) {
  const requestPermissions: Partial<{ [key in Permission]: boolean }> = {};

  ALL_PERMISSIONS.map(permissionDefinition => {
    const rolePermission = rolePermissions.find(
      ({ id }) => id === permissionDefinition.id
    );

    requestPermissions[permissionDefinition.id] = rolePermission
      ? rolePermission.enabled
      : false;
  });

  request.permissions = requestPermissions;
}
