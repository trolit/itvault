import { Schema } from "yup";
import type { NextFunction, Response } from "express";
import { StatusCodes as HTTP } from "http-status-codes";
import { SuperKeys, SuperSchema, SuperSchemaRunner } from "super-schema-types";

import { formatError } from "@helpers/yup/formatError";

import { useVersionSchema } from "@schemas/common/useVersionSchema";

export const validateRequestWith = <P, B, Q>(
  useSuperSchemaRunner: SuperSchemaRunner<P, B, Q>,
  data: {
    versions: string[];
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

    includeGeneralQuerySchemas(superSchema, data);

    for (const key in superSchema) {
      const schema = <Schema>superSchema[key as keyof SuperSchema];

      if (!schema) {
        return response
          .status(HTTP.INTERNAL_SERVER_ERROR)
          .send(`Failed to load '${key}' schema!`);
      }

      const superKey = key as keyof SuperKeys;

      try {
        const parsedData = await schema.validate(request[superKey], {
          abortEarly: false,
          stripUnknown: true,
        });

        // overwrites body with sanitized result
        request[superKey as keyof SuperKeys] = parsedData;
      } catch (error) {
        return response.status(HTTP.BAD_REQUEST).send({
          [superKey]: formatError(error),
        });
      }
    }

    next();
  };
};

function includeGeneralQuerySchemas(
  superSchema: SuperSchema,
  data: { versions: string[] }
) {
  const querySchema = <Schema>superSchema["query" as keyof SuperSchema];

  const versionSchema = useVersionSchema(data.versions);

  (superSchema as SuperSchema<unknown, unknown, 1>).query = querySchema
    ? querySchema.concat(versionSchema)
    : versionSchema;
}
