import { ZodError, ZodSchema } from "zod";
import IncomingForm from "formidable/Formidable";
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
    fieldsOrder?: string[];
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

    const { fieldsOrder, ...formOptions } = options;

    const form = await formidableFormFactory.create({
      ...formOptions,
      destination: `workspace-${workspaceId}`,
    });

    if (fieldsOrder?.length) {
      setFieldsOrderValidation(form, fieldsOrder);
    }

    form.parse(request, async (error, fields, files) => {
      if (error) {
        console.error(error);

        return response.status(HTTP.BAD_REQUEST).send();
      }

      const mappedFiles = mapFormDataFiles(files);

      if (!mappedFiles.length) {
        return response.status(HTTP.BAD_REQUEST).send();
      }

      if (validators) {
        const errors = await runValidators(
          { fields, files: mappedFiles },
          validators
        );

        if (errors) {
          // @TODO remove files

          return response.status(HTTP.BAD_REQUEST).send(errors.format());
        }
      }

      request.body = fields;

      request.files = mappedFiles;

      next();
    });
  };
};

function setFieldsOrderValidation(form: IncomingForm, fieldsOrder: string[]) {
  let fieldsOrderIndex = 0;

  form.on("field", name => {
    if (name !== fieldsOrder[fieldsOrderIndex]) {
      throw `Invalid fields order at position ${fieldsOrderIndex} (expected: ${fieldsOrder[fieldsOrderIndex]}, received: ${name})`;
    }

    fieldsOrderIndex++;
  });
}

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
