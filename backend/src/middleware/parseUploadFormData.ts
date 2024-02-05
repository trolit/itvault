import { Schema } from "yup";
import IncomingForm from "formidable/Formidable";
import { IFormDataFile } from "types/IFormDataFile";
import { StatusCodes as HTTP } from "http-status-codes";
import type { Request, NextFunction, Response } from "express";
import { IFormidableFormFactory } from "types/factories/IFormidableFormFactory";

import { APP } from "@config";

import { Di } from "@enums/Di";

import { formatError } from "@helpers/yup/formatError";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { mapFormDataFiles } from "@helpers/mapFormDataFiles";

interface IFormValidators {
  files?: Schema<IFormDataFile[]>;

  fields?: Schema;
}

export const parseUploadFormData = (
  options: {
    basePath: string;
    multiples: boolean;
    fieldsOrder?: string[];
  },
  validators?: IFormValidators
) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const {
      query: { workspaceId },
    } = request;

    if (APP.IS_CLEARING_TEMPORARY_UPLOADS_DIR) {
      return response.status(HTTP.SERVICE_UNAVAILABLE).send();
    }

    const formidableFormFactory = getInstanceOf<IFormidableFormFactory>(
      Di.FormidableFormFactory
    );

    const { fieldsOrder, ...formOptions } = options;

    const form = await formidableFormFactory.create({
      ...formOptions,
      destination: `workspace-${workspaceId}`,
    });

    if (fieldsOrder?.length) {
      // @NOTE force specific order - before parsing files we can check if required fields are defined
      setFieldsOrderValidation(form, fieldsOrder);
    }

    form.parse(request, async (error, fields, files) => {
      if (error) {
        console.error(error);

        return response.status(HTTP.BAD_REQUEST).send();
      }

      const mappedFiles = mapFormDataFiles(files);

      if (validators) {
        const errors = await handleValidators(
          { fields, files: mappedFiles },
          validators
        );

        if (errors) {
          // @TODO remove files

          return response.status(HTTP.BAD_REQUEST).send({ body: errors });
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

async function handleValidators<T>(
  data: {
    files: IFormDataFile[];
    fields: T;
  },
  validators?: IFormValidators
) {
  if (!validators) {
    return null;
  }

  const { files, fields } = data;

  try {
    if (validators.fields) {
      await validators.fields.validate(fields, { abortEarly: false });
    }

    if (validators.files) {
      await validators.files.validate(files, { abortEarly: false });
    }
  } catch (error) {
    return formatError(error);
  }

  return null;
}
