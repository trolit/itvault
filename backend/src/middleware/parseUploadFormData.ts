import { Schema } from "yup";
import IncomingForm from "formidable/Formidable";
import { IFormDataFile } from "types/IFormDataFile";
import { StatusCodes as HTTP } from "http-status-codes";
import type { Request, NextFunction, Response } from "express";
import { IFormidableFormFactory } from "types/factories/IFormidableFormFactory";

import { APP } from "@config/index";

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
      setFieldsOrderValidation(form, fieldsOrder);
    }

    form.parse(request, async (error, fields, files) => {
      if (error) {
        console.error(error);

        return response.status(HTTP.BAD_REQUEST).send();
      }

      const mappedFiles = mapFormDataFiles(files);

      if (validators) {
        const isValidOrErrors = await handleValidators(
          { fields, files: mappedFiles },
          validators
        );

        if (!(typeof isValidOrErrors === "boolean")) {
          // @TODO remove files

          return response
            .status(HTTP.BAD_REQUEST)
            .send({ body: isValidOrErrors });
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
    return true;
  }

  const { files, fields } = data;

  try {
    if (validators.fields) {
      await validators.fields.validate(fields);
    }

    if (validators.files) {
      await validators.files.validate(files);
    }

    return true;
  } catch (error) {
    console.log(error);

    return formatError(error);
  }
}
