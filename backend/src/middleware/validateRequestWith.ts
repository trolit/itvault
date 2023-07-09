import { z, ZodSchema, ZodType } from "zod";
import { StatusCodes as HTTP } from "http-status-codes";
import type { NextFunction, Request, Response } from "express";
import { SuperKeys, SuperSchema, SuperSchemaRunner } from "super-schema-types";

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

    const versionSchema = getVersionSchema(data.versions);

    const commonSchemasResults = await runCommonSchemasOnMissingKeys(
      superSchema,
      request,
      {
        versionSchema,
      }
    );

    if (commonSchemasResults && !commonSchemasResults.success) {
      return response
        .status(HTTP.BAD_REQUEST)
        .send(commonSchemasResults.error.format());
    }

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

      const extendedSchema = extendSchema(propertyName, schema, {
        versionSchema,
      });

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

async function runCommonSchemasOnMissingKeys(
  superSchema: SuperSchema,
  request: Request,
  schemas: {
    versionSchema: ZodSchema;
  }
) {
  const keys = Object.keys(superSchema);

  if (!keys.includes("query")) {
    return schemas.versionSchema.safeParseAsync({
      version: request.query.version,
    });
  }
}

function extendSchema(
  key: keyof SuperKeys,
  schema: ZodType,
  schemas: {
    versionSchema: ZodSchema;
  }
) {
  if (key === "query") {
    return z.intersection(schema, schemas.versionSchema);
  }

  return schema;
}
