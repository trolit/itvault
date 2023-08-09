import type { NextFunction, Response } from "express";
import { StatusCodes as HTTP } from "http-status-codes";

import { Permission } from "@shared/types/enums/Permission";
import { isPermissionEnabled } from "@shared/helpers/isPermissionEnabled";

export const requirePermissions = <P, B, Q>(
  context: Permission[] | ((request: CustomRequest<P, B, Q>) => boolean)
) => {
  return async (
    request: CustomRequest<P, B, Q>,
    response: Response,
    next: NextFunction
  ) => {
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
