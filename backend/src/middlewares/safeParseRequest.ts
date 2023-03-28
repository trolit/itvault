import { ZodSchema } from "zod";
import { StatusCodes as HTTP } from "http-status-codes";
import { NextFunction, Request, Response } from "express";

import { ParseableRequestContent } from "@utilities/types";

export const safeParseRequest = (toParse: ParseableRequestContent) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    for (const key in toParse) {
      const castedKey = <keyof ParseableRequestContent>key;

      const schema = toParse[castedKey]?.withSchema;

      if (!schema) {
        return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
      }

      const result = await parseElement(request, castedKey, schema);

      if (!result.success) {
        return response.status(HTTP.BAD_REQUEST).send(result.error.format());
      }

      // overwrite body with sanitized result
      request[castedKey] = result.data;
    }

    next();
  };
};

function parseElement(
  request: Request,
  key: keyof ParseableRequestContent,
  schema: ZodSchema
) {
  return schema.safeParseAsync(request[key]);
}
