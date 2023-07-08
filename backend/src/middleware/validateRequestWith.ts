import { z, ZodType } from "zod";
import { StatusCodes as HTTP } from "http-status-codes";
import type { NextFunction, Request, Response } from "express";
import { SuperKeys, SuperSchemaRunner } from "super-schema-types";

import { getVersionSchema } from "@schemas/common/getVersionSchema";

export const validateRequestWith = (
  useSuperSchemaRunner: SuperSchemaRunner,
  data: {
    versions: number[];
  }
) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const superSchema = await useSuperSchemaRunner({
      request,
    });

    for (const key in superSchema) {
      const propertyName = <keyof SuperKeys>key;

      const useSchemaProvider = superSchema[propertyName];

      if (!useSchemaProvider) {
        continue;
      }

      const schema = await useSchemaProvider();

      if (!schema) {
        return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
      }

      const extendedSchema = extendSchema(propertyName, schema, data);

      const result = await extendedSchema.safeParseAsync(request[propertyName]);

      if (!result.success) {
        return response.status(HTTP.BAD_REQUEST).send(result.error.format());
      }

      // overwrite body with sanitized result
      request[propertyName] = result.data;
    }

    next();
  };
};

function extendSchema(
  key: keyof SuperKeys,
  schema: ZodType,
  data: {
    versions: number[];
  }
) {
  if (key === "query") {
    return z.intersection(schema, getVersionSchema(data.versions));
  }

  return schema;
}
