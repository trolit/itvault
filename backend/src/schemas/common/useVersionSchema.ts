import { object, string } from "yup";
import { SuperSchemaElement } from "super-schema-types";

import { MESSAGES } from "@helpers/yup/messages";
import { setYupError } from "@helpers/yup/setError";

export const useVersionSchema: (
  versions: string[]
) => SuperSchemaElement<{ version: string }> = (versions: string[]) =>
  object({
    version: string()
      .required()
      .oneOf(versions, setYupError(MESSAGES.GENERAL.WRONG_VERSION)),
  });
