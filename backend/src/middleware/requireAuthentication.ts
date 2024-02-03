import { DataStore } from "types/DataStore";
import type { NextFunction, Response } from "express";
import { StatusCodes as HTTP } from "http-status-codes";
import { IAuthService } from "types/services/IAuthService";

import { JWT } from "@config";
import { PERMISSIONS } from "@config/permissions";

import { Di } from "@enums/Di";
import { Permission } from "@shared/types/enums/Permission";

import { getInstanceOf } from "@helpers/getInstanceOf";

export const requireAuthentication = (<P, B, Q>() => {
  return async (
    request: CustomRequest<P, B, Q>,
    response: Response,
    next: NextFunction
  ) => {
    const authService = getInstanceOf<IAuthService>(Di.AuthService);

    const userId = analyzeTokenFromRequest(request, authService);

    if (!userId) {
      return response.status(HTTP.UNAUTHORIZED).send();
    }

    const role = await authService.getSignedUserRole(userId);

    if (!role) {
      return response.status(HTTP.UNAUTHORIZED).send();
    }

    assignPermissionsToRequest(request, role.permissions);

    next();
  };
})();

function analyzeTokenFromRequest<P, B, Q>(
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
  rolePermissions: DataStore.Permission[]
) {
  const requestPermissions: Partial<{ [key in Permission]: boolean }> = {};

  Object.values(PERMISSIONS).map(permissionDefinition => {
    const rolePermission = rolePermissions.find(
      ({ signature }) => signature === permissionDefinition.signature
    );

    requestPermissions[permissionDefinition.signature] = rolePermission
      ? rolePermission.enabled
      : false;
  });

  request.permissions = requestPermissions;
}
