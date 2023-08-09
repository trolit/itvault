import { object, string } from "yup";
import sanitizeHtml from "sanitize-html";
import { SuperSchema } from "types/SuperSchema";
import { UpdateControllerTypes } from "types/controllers/Note/UpdateController";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const bodySchema: SuperSchema.Fragment<UpdateControllerTypes.v1.Body> = object({
  text: string()
    .required()
    .transform(value => sanitizeHtml(value)),
});

export const useUpdateSuperSchema: SuperSchema.Runner<
  void,
  UpdateControllerTypes.v1.Body,
  void
> = defineSuperSchemaRunner(() => {
  return {
    body: bodySchema,
  };
});
