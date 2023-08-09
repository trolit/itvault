import { object, string } from "yup";
import { SuperSchema } from "types/SuperSchema";

import { setYupError } from "@helpers/yup/setError";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

export const useVersionSchema: (
  versions: string[]
) => SuperSchema.Fragment<{ version: string }> = (versions: string[]) =>
  object({
    version: string()
      .required()
      .oneOf(versions, setYupError(CUSTOM_MESSAGES.GENERAL.WRONG_VERSION)),
  });
