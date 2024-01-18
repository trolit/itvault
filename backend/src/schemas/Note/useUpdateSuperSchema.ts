import { object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { UpdateControllerTypes } from "types/controllers/Note/UpdateController";

import { textSchema } from "@schemas/common/useTextSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const bodySchema: SuperSchema.Fragment<UpdateControllerTypes.v1.Body> = object({
  text: textSchema,
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
