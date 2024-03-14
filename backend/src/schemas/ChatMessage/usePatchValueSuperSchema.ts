import { number, object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { PatchValueControllerTypes } from "types/controllers/ChatMessage/PatchValueController";

import { CHAT_MESSAGE_RULES } from "@shared/constants/rules";

import { useTextSchema } from "@schemas/common/useTextSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const { MIN_LENGTH, MAX_LENGTH } = CHAT_MESSAGE_RULES.VALUE;

const paramsSchema: SuperSchema.Fragment<PatchValueControllerTypes.v1.Params> =
  object({
    id: number().required(),
  });

const bodySchema: SuperSchema.Fragment<PatchValueControllerTypes.v1.Body> =
  object({
    text: useTextSchema(MIN_LENGTH, MAX_LENGTH),
  });

export const usePatchValueSuperSchema: SuperSchema.Runner<
  PatchValueControllerTypes.v1.Params,
  PatchValueControllerTypes.v1.Body,
  void
> = defineSuperSchemaRunner(() => {
  return {
    params: paramsSchema,
    body: bodySchema,
  };
});
