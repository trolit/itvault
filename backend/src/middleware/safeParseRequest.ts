import { StatusCodes as HTTP } from "http-status-codes";
import { NextFunction, Request, Response } from "express";

import { SuperSchemaRunner } from "@utils/types";
import { ISuperSchemaProperties } from "@interfaces/ISuperSchemaProperties";

export const safeParseRequest = (superSchemaRunner: SuperSchemaRunner) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const superSchema = await superSchemaRunner({ request });

    for (const key in superSchema) {
      const propertyName = <keyof ISuperSchemaProperties>key;

      const schemaProvider = superSchema[propertyName];

      if (!schemaProvider) {
        continue;
      }

      const schema = await schemaProvider();

      if (!schema) {
        return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
      }

      const result = await schema.safeParseAsync(request[propertyName]);

      if (!result.success) {
        return response.status(HTTP.BAD_REQUEST).send(result.error.format());
      }

      // overwrite body with sanitized result
      request[propertyName] = result.data;
    }

    next();
  };
};
