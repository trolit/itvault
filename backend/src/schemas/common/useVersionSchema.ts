import { object, string } from "yup";
import { SuperSchemaElement } from "super-schema-types";

import { setYupError } from "@helpers/yup/setError";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

export const useVersionSchema: (
  versions: string[]
) => SuperSchemaElement<{ version: string }> = (versions: string[]) =>
  object({
    version: string()
      .required()
      .oneOf(versions, setYupError(CUSTOM_MESSAGES.GENERAL.WRONG_VERSION)),
  });
