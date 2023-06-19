import { ZodError, ZodSchema } from "zod";
import { StatusCodes as HTTP } from "http-status-codes";
import type { Request, NextFunction, Response } from "express";

import { Di } from "@enums/Di";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { IFormDataFile } from "@interfaces/IFormDataFile";
import { mapFormDataFiles } from "@helpers/mapFormDataFiles";
import { IFormidableFormFactory } from "@interfaces/factory/IFormidableFormFactory";

export const parseUploadFormData = <T>(
  options: {
    basePath: string;
    multiples: boolean;
  },
  validators?: { files?: ZodSchema<IFormDataFile[]>; fields?: ZodSchema<T> }
) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const {
      params: { workspaceId },
    } = request;

    const formidableFormFactory = getInstanceOf<IFormidableFormFactory>(
      Di.FormidableFormFactory
    );

    const form = await formidableFormFactory.create({
      ...options,
      destination: `workspace-${workspaceId}`,
    });

    form.parse(request, async (error, fields, files) => {
      if (error) {
        console.error(error);

        return response.status(HTTP.BAD_REQUEST).send();
      }

      const mappedFiles = mapFormDataFiles(files);

      if (validators) {
        const errors = await runValidators(
          { fields, files: mappedFiles },
          validators
        );

        if (errors) {
          return response.status(HTTP.BAD_REQUEST).send(errors.format());
        }

        // @TODO remove files
      }

      request.body = fields;

      request.files = mappedFiles;

      next();
    });
  };
};

async function runValidators<T>(
  data: { files: IFormDataFile[]; fields: T },
  validators: {
    files?: ZodSchema;
    fields?: ZodSchema;
  }
): Promise<ZodError | null> {
  const { fields, files } = data;

  if (validators.fields) {
    const result = await validators.fields.safeParseAsync(fields);

    if (!result.success) {
      return result.error;
    }
  }

  if (validators.files) {
    const result = await validators.files.safeParseAsync(files);

    if (!result.success) {
      return result.error;
    }
  }

  return null;
}
