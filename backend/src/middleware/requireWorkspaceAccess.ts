import type { NextFunction, Response } from "express";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Permission } from "@shared/types/enums/Permission";
import { IUserRepository } from "@interfaces/repositories/IUserRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";
import { isPermissionEnabled } from "@helpers/isPermissionEnabled";

interface IQuery {
  workspaceId: number;
}

export const requireWorkspaceAccess = (() => {
  return async (
    request: CustomRequest<unknown, unknown, IQuery>,
    response: Response,
    next: NextFunction
  ) => {
    const userRepository = getInstanceOf<IUserRepository>(Di.UserRepository);

    const {
      userId,
      query: { workspaceId },
    } = request;

    if (!userId || !workspaceId) {
      return response.status(HTTP.FORBIDDEN).send();
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
})();
