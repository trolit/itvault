import { object, string } from "yup";
import sanitizeHtml from "sanitize-html";
import { SuperSchemaRunner, SuperSchemaElement } from "super-schema-types";
import { UpdateControllerTypes } from "types/controllers/Note/UpdateController";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const bodySchema: SuperSchemaElement<UpdateControllerTypes.v1.Body> = object({
  text: string()
    .required()
    .transform(value => sanitizeHtml(value)),
});

export const useUpdateSuperSchema: SuperSchemaRunner<
  void,
  UpdateControllerTypes.v1.Body,
  void
> = defineSuperSchemaRunner(() => {
  return {
    body: bodySchema,
  };
});
