import { SuperSchema } from "super-schema-types";
import type { NextFunction, Response } from "express";
import { StatusCodes as HTTP } from "http-status-codes";
import { SuperKeys, SuperSchemaRunner } from "super-schema-types";

import { formatError } from "@helpers/yup/formatError";

import { useVersionSchema } from "@schemas/common/getVersionSchema";

export const validateRequestWith = <P, B, Q>(
  useSuperSchemaRunner: SuperSchemaRunner<CustomRequest<P, B, Q>>,
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

    includeGeneralQuerySchemas(superSchema, data);

    for (const key in superSchema) {
      const propertyName = <keyof SuperKeys>key;

      const schema = superSchema[propertyName];

      if (!schema) {
        return response
          .status(HTTP.INTERNAL_SERVER_ERROR)
          .send(`Failed to load '${key}' schema!`);
      }

      try {
        const parsedData = await schema.validate(request[propertyName], {
          abortEarly: false,
          stripUnknown: true,
        });

        // overwrites body with sanitized result
        request[propertyName] = parsedData;
      } catch (error) {
        return response.status(HTTP.BAD_REQUEST).send({
          [propertyName]: formatError(error),
        });
      }
    }

    next();
  };
};

function includeGeneralQuerySchemas(
  superSchema: SuperSchema,
  data: { versions: number[] }
) {
  const querySchema = superSchema["query"];

  const versionSchema = useVersionSchema(data.versions);

  if (querySchema) {
    querySchema.concat(versionSchema);

    return;
  }

  superSchema.query = versionSchema;
}
