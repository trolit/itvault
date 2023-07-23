import type { NextFunction, Response } from "express";
import { DataStorePermission } from "data-store-types";
import { StatusCodes as HTTP } from "http-status-codes";

import { JWT } from "@config";
import { ALL_PERMISSIONS } from "@config/permissions";

import { Di } from "@enums/Di";
import { Permission } from "@enums/Permission";
import { IAuthService } from "@interfaces/services/IAuthService";

import { getInstanceOf } from "@helpers/getInstanceOf";

export const requireAuthentication = (<P, B, Q>() => {
  return async (
    request: CustomRequest<P, B, Q>,
    response: Response,
    next: NextFunction
  ) => {
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

function processTokenFromRequest<P, B, Q>(
  request: CustomRequest<P, B, Q>,
  authService: IAuthService
) {
  const token = request.cookies[JWT.COOKIE_KEY];

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

function assignPermissionsToRequest<P, B, Q>(
  request: CustomRequest<P, B, Q>,
  rolePermissions: DataStorePermission[]
) {
  const requestPermissions: Partial<{ [key in Permission]: boolean }> = {};

  ALL_PERMISSIONS.map(permissionDefinition => {
    const rolePermission = rolePermissions.find(
      ({ signature }) => signature === permissionDefinition.signature
    );

    requestPermissions[permissionDefinition.signature] = rolePermission
      ? rolePermission.enabled
      : false;
  });

  request.permissions = requestPermissions;
}
