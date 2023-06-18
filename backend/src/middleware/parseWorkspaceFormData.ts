import { StatusCodes as HTTP } from "http-status-codes";
import type { Request, NextFunction, Response } from "express";

import { Di } from "@enums/Di";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { IFormidableFormFactory } from "@interfaces/factory/IFormidableFormFactory";

export const parseWorkspaceFormData = (options: {
  basePath: string;
  multiples: boolean;
}) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    if (!request.params.workspaceId) {
      return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
    }

    const formidableFormFactory = getInstanceOf<IFormidableFormFactory>(
      Di.FormidableFormFactory
    );

    const form = await formidableFormFactory.create({
      ...options,
      destination: `workspace-${request.params.workspaceId}`,
    });

    form.parse(request, (error, fields, files) => {
      if (error) {
        console.error(error);

        return response.status(HTTP.BAD_REQUEST).send();
      }

      request.body = fields;

      request.files = files;

      next();
    });
  };
};
