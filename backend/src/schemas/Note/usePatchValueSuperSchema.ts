import { object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { PatchValueControllerTypes } from "types/controllers/Note/PatchValueController";

import { NOTE_RULES } from "@shared/constants/rules";

import { useTextSchema } from "@schemas/common/useTextSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const bodySchema: SuperSchema.Fragment<PatchValueControllerTypes.v1.Body> =
  object({
    text: useTextSchema(NOTE_RULES.VALUE.MAX_LENGTH),
  });

export const usePatchValueSuperSchema: SuperSchema.Runner<
  void,
  PatchValueControllerTypes.v1.Body,
  void
> = defineSuperSchemaRunner(() => {
  return {
    body: bodySchema,
  };
});
