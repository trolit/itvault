import { z, ZodSchema, ZodType } from "zod";
import type { NextFunction, Response } from "express";
import { StatusCodes as HTTP } from "http-status-codes";
import { SuperKeys, SuperSchemaRunner } from "super-schema-types";

import { getVersionSchema } from "@schemas/common/getVersionSchema";

export const validateRequestWith = <P, B, Q>(
  useSuperSchemaRunner: SuperSchemaRunner<P, B, Q>,
  data: {
    versions: number[];
  }
) => {
  return async (
    request: CustomRequest<P, B, Q>,
    response: Response,
    next: NextFunction
  ) => {
    const superSchema = await useSuperSchemaRunner({
      request,
    });

    const versionSchema = getVersionSchema(data.versions);

    const generalSchemasError = await runGeneralSchemasOnMissingKeys(
      Object.keys(superSchema),
      request,
      {
        versionSchema,
      }
    );

    if (generalSchemasError) {
      return response
        .status(HTTP.BAD_REQUEST)
        .send(generalSchemasError.format());
    }

    for (const key in superSchema) {
      const propertyName = <keyof SuperKeys>key;

      const useSchemaProvider = superSchema[propertyName];

      if (!useSchemaProvider) {
        return response
          .status(HTTP.INTERNAL_SERVER_ERROR)
          .send(`Super Schema incorrectly implements '${key}' schema.`);
      }

      const schema = await useSchemaProvider();

      if (!schema) {
        return response
          .status(HTTP.INTERNAL_SERVER_ERROR)
          .send(`Failed to load '${key}' schema.`);
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

async function runGeneralSchemasOnMissingKeys<P, B, Q>(
  keys: string[],
  request: CustomRequest<P, B, Q>,
  schemas: {
    versionSchema: ZodSchema;
  }
) {
  if (!keys.includes("query")) {
    const result = await schemas.versionSchema.safeParseAsync(request.query);

    if (!result.success) {
      return result.error;
    }

    request.query = result.data;

    return null;
  }

  return null;
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
