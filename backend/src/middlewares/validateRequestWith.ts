import { ZodType } from "zod";
import { NextFunction, Response } from "express";
import { StatusCodes as HTTP } from "http-status-codes";

import { LoginDto } from "@dtos/Login";
import { RequestOfType } from "@utilities/types";

export const validateRequestWith = (schema: ZodType) => {
  return async (
    request: RequestOfType<LoginDto>,
    response: Response,
    next: NextFunction
  ) => {
    const result = await schema.safeParseAsync(request.body);

    if (!result.success) {
      return response.status(HTTP.BAD_REQUEST).send(result.error.format());
    }

    next();
  };
};
