import { StatusCodes as HTTP } from "http-status-codes";
import type { Request, NextFunction, Response } from "express";

import { Di } from "@enums/Di";
import { IWorkspaceRepository } from "@interfaces/repositories/IWorkspaceRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

// @NOTE better to use in case of "parseUploadFormData" middleware
export const IsWorkspaceAvailable = (() => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const workspaceRepository = getInstanceOf<IWorkspaceRepository>(
      Di.WorkspaceRepository
    );

    const workspace = await workspaceRepository.getById(
      request.params.workspaceId
    );

    if (!workspace) {
      return response.status(HTTP.BAD_REQUEST).send();
    }

    next();
  };
})();
