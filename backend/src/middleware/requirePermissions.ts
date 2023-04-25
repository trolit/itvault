import { StatusCodes as HTTP } from "http-status-codes";
import { Request, NextFunction, Response } from "express";

import { Permission } from "@enums/Permission";
import { isPermissionEnabled } from "@helpers/isPermissionEnabled";

export const requirePermissions = (
  context: Permission[] | ((request: Request) => boolean)
) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const { permissions } = request;

    if (!permissions) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    if (Array.isArray(context)) {
      for (const permission of context) {
        if (!isPermissionEnabled(permission, permissions)) {
          return response.status(HTTP.FORBIDDEN).send();
        }
      }

      return next();
    }

    const isMissingPermissions = context(request);

    return isMissingPermissions
      ? response.status(HTTP.FORBIDDEN).send()
      : next();
  };
};
