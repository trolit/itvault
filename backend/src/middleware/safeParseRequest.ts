import { StatusCodes as HTTP } from "http-status-codes";
import { NextFunction, Request, Response } from "express";

import { RequestParseContext } from "@utils/types";

export const safeParseRequest = <T>(context: RequestParseContext<T>) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    for (const key in context) {
      type ParseableProperties = Omit<RequestParseContext<T>, "data">;

      const propertyName = <keyof ParseableProperties>key;

      const parseableProperties: ParseableProperties = context;

      const superSchemaRunner = parseableProperties[propertyName]?.withSchema;

      if (!superSchemaRunner) {
        return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
      }

      const schema = superSchemaRunner({ request }, context.data);

      if (!schema) {
        return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
      }

      const result = await schema.safeParseAsync(
        parseableProperties[propertyName]
      );

      if (!result.success) {
        return response.status(HTTP.BAD_REQUEST).send(result.error.format());
      }

      // overwrite body with sanitized result
      request[propertyName] = result.data;
    }

    next();
  };
};
