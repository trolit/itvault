import { ZodType } from "zod";
import { NextFunction, Response } from "express";
import { StatusCodes as HTTP } from "http-status-codes";

import { RequestOfType } from "@utilities/types";

export const safeParseRequest = <T>(schema: ZodType) => {
  return async (
    request: RequestOfType<T>,
    response: Response,
    next: NextFunction
  ) => {
    const result = await schema.safeParseAsync(request.body);

    if (!result.success) {
      return response.status(HTTP.BAD_REQUEST).send(result.error.format());
    }

    // overwrite body with sanitized result
    request.body = result.data;

    next();
  };
};
