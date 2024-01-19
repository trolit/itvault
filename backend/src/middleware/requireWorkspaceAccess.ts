import type { NextFunction, Response } from "express";
import { StatusCodes as HTTP } from "http-status-codes";
import { IUserRepository } from "types/repositories/IUserRepository";

import { Di } from "@enums/Di";
import { Permission } from "@shared/types/enums/Permission";
import { isPermissionEnabled } from "@shared/helpers/isPermissionEnabled";

import { getInstanceOf } from "@helpers/getInstanceOf";

export const requireWorkspaceAccess = <T>(
  id: (request: CustomRequest<T, unknown, T>) => number
) => {
  return async (
    request: CustomRequest<T, unknown, T>,
    response: Response,
    next: NextFunction
  ) => {
    const userRepository = getInstanceOf<IUserRepository>(Di.UserRepository);

    const { userId } = request;

    const workspaceId = id(request);

    if (!userId || !workspaceId) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    if (isNaN(workspaceId)) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    if (
      isPermissionEnabled(Permission.ViewAllWorkspaces, request.permissions)
    ) {
      return next();
    }

    const isPermittedToAccessWorkspace = await userRepository.getOne({
      where: {
        userToWorkspace: {
          userId,
          workspaceId,
        },
      },
    });

    if (!isPermittedToAccessWorkspace) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    next();
  };
};
