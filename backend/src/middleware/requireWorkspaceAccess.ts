import type { NextFunction, Response } from "express";
import { StatusCodes as HTTP } from "http-status-codes";

import { Di } from "@enums/Di";
import { Permission } from "@enums/Permission";
import { IUserRepository } from "@interfaces/repositories/IUserRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";
import { isPermissionEnabled } from "@helpers/isPermissionEnabled";

interface IParams {
  workspaceId: number;
}

export const requireWorkspaceAccess = (() => {
  return async (
    request: CustomRequest<IParams>,
    response: Response,
    next: NextFunction
  ) => {
    const userRepository = getInstanceOf<IUserRepository>(Di.UserRepository);

    const {
      userId,
      params: { workspaceId },
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
