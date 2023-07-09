import type { NextFunction, Response } from "express";
import { StatusCodes as HTTP } from "http-status-codes";

import { getVersionSchema } from "@schemas/common/getVersionSchema";

// @NOTE do not mix with "validateRequestWith" if it has `query` scheme
export const requireEndpointVersion = <P, B, Q>(versions: number[]) => {
  return async (
    request: CustomRequest<P, B, Q>,
    response: Response,
    next: NextFunction
  ) => {
    if (!versions.length) {
      return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
    }

    const versionSchema = getVersionSchema(versions);

    const { version } = request.query;

    const result = await versionSchema.safeParseAsync(version);

    if (!result.success) {
      return response.status(HTTP.BAD_REQUEST).send(result.error.format());
    }

    request.query.version = result.data.version;

    next();
  };
};
