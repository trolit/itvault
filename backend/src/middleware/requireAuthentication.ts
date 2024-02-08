import { DataStore } from "types/DataStore";
import type { NextFunction, Response } from "express";
import { StatusCodes as HTTP } from "http-status-codes";
import { IAuthService } from "types/services/IAuthService";
import { IUserRepository } from "types/repositories/IUserRepository";

import { JWT } from "@config";
import { PERMISSIONS_AS_ARRAY } from "@config/permissions";

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

    const tokenPayload = analyzeTokenFromRequest(request, authService);

    if (!tokenPayload) {
      log.debug({
        message: "Failed to authenticate (missing token)!",
      });

      return response.status(HTTP.UNAUTHORIZED).send();
    }

    const userRepository = getInstanceOf<IUserRepository>(Di.UserRepository);

    const user = await userRepository.getOne({
      where: {
        id: tokenPayload.id,
      },
      loadRelationIds: {
        relations: ["role"],
      },
    });

    if (!user || typeof user.role !== "number") {
      log.debug({
        message: "Failed to authenticate (user not found or invalid query)!",
      });

      return response.status(HTTP.UNAUTHORIZED).send();
    }

    const roleId = <number>user.role;

    const role = await authService.getRoleFromDataStore(roleId);

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

  const { payload } = result;

  request.userId = payload.id;

  return payload;
}

function assignPermissionsToRequest<P, B, Q>(
  request: CustomRequest<P, B, Q>,
  rolePermissions: DataStore.Permission[]
) {
  const requestPermissions: Partial<{ [key in Permission]: boolean }> = {};

  PERMISSIONS_AS_ARRAY.map(permissionDefinition => {
    const rolePermission = rolePermissions.find(
      ({ signature }) => signature === permissionDefinition.signature
    );

    requestPermissions[permissionDefinition.signature] = rolePermission
      ? rolePermission.enabled
      : false;
  });

  request.permissions = requestPermissions;
}
