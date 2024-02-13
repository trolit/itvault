import { number, object, string } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { PatchNoteControllerTypes } from "types/controllers/Bundle/PatchNoteController";

import { BUNDLE_RULES } from "@shared/constants/rules";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const {
  TEXT: { MIN_LENGTH, MAX_LENGTH },
} = BUNDLE_RULES;

const paramsSchema: SuperSchema.Fragment<PatchNoteControllerTypes.v1.Params> =
  object({
    id: number().required(),
  });

const querySchema: SuperSchema.Fragment<PatchNoteControllerTypes.v1.Query> =
  object({
    workspaceId: number().required(),
  });

const bodySchema: SuperSchema.Fragment<PatchNoteControllerTypes.v1.Body> =
  object({
    text: string().required().min(MIN_LENGTH).max(MAX_LENGTH),
  });

export const usePatchNoteSuperSchema: SuperSchema.Runner<
  PatchNoteControllerTypes.v1.Params,
  PatchNoteControllerTypes.v1.Body,
  PatchNoteControllerTypes.v1.Query
> = defineSuperSchemaRunner(() => {
  return {
    params: paramsSchema,
    query: querySchema,
    body: bodySchema,
  };
});
