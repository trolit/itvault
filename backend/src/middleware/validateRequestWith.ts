import { Schema } from "yup";
import type { NextFunction, Response } from "express";
import { StatusCodes as HTTP } from "http-status-codes";
import { SuperKeys, SuperSchema, SuperSchemaRunner } from "super-schema-types";

import { formatError } from "@helpers/yup/formatError";

export const validateRequestWith = <P, B, Q>(
  superSchemaRunners: Record<string, SuperSchemaRunner<P, B, Q>>
) => {
  return async (
    request: CustomRequest<P, B, Q>,
    response: Response,
    next: NextFunction
  ) => {
    const {
      query: { version: requestedVersion },
    } = request;

    const versions = Object.keys(superSchemaRunners);

    if (!versions.includes(requestedVersion)) {
      return response.status(HTTP.BAD_REQUEST).send({
        query: {
          version: `Wrong resource version (available: ${versions.join(", ")})`,
        },
      });
    }

    const useSuperSchemaRunner = superSchemaRunners[requestedVersion];

    if (!useSuperSchemaRunner) {
      return response
        .status(HTTP.INTERNAL_SERVER_ERROR)
        .send(`Oops... Resource version is defined but not implemented!`);
    }

    const superSchema = await useSuperSchemaRunner({
      request,
    });

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
