import { StatusCodes as HTTP } from "http-status-codes";
import type { NextFunction, Response } from "express";

import { Di } from "@enums/Di";
import { Permission } from "@enums/Permission";
import { CustomRequest } from "@custom-types/express";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { IUserRepository } from "@interfaces/repository/IUserRepository";

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

    if (request.permissions[Permission.ViewAllWorkspaces]) {
      return next();
    }

    const isPermittedToAccessWorkspace =
      await userRepository.isPermittedToAccessWorkspace(userId, workspaceId);

    if (!isPermittedToAccessWorkspace) {
      return response.status(HTTP.FORBIDDEN).send();
    }

    next();
  };
})();
