import { number, object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { PatchValueControllerTypes } from "types/controllers/Note/PatchValueController";

import { NOTE_RULES } from "@shared/constants/rules";

import { useTextSchema } from "@schemas/common/useTextSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchema.Fragment<PatchValueControllerTypes.v1.Query> =
  object({
    workspaceId: number().required(),
  });

const bodySchema: SuperSchema.Fragment<PatchValueControllerTypes.v1.Body> =
  object({
    text: useTextSchema(NOTE_RULES.VALUE.MAX_LENGTH),
  });

export const usePatchValueSuperSchema: SuperSchema.Runner<
  void,
  PatchValueControllerTypes.v1.Body,
  PatchValueControllerTypes.v1.Query
> = defineSuperSchemaRunner(() => {
  return {
    query: querySchema,
    body: bodySchema,
  };
});
