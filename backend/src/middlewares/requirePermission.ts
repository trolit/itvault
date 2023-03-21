import { StatusCodes as HTTP } from "http-status-codes";
import { Request, NextFunction, Response } from "express";

import { Permission } from "@enums/Permission";
import { PermissionService } from "@services/PermissionService";

export const requirePermission = (permission: Permission) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const permissionService = new PermissionService();

    const hasRequiredPermission = await permissionService.hasPermission(
      1, // @TBD
      permission
    );

    if (!hasRequiredPermission) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    next();
  };
};
