import { number, object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { UpdateControllerTypes } from "types/controllers/ChatMessage/UpdateController";

import { CHAT_MESSAGE_RULES } from "@shared/constants/rules";

import { useTextSchema } from "@schemas/common/useTextSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const paramsSchema: SuperSchema.Fragment<UpdateControllerTypes.v1.Params> =
  object({
    id: number().required(),
  });

const bodySchema: SuperSchema.Fragment<UpdateControllerTypes.v1.Body> = object({
  text: useTextSchema(CHAT_MESSAGE_RULES.VALUE.MAX_LENGTH),
});

const querySchema: SuperSchema.Fragment<UpdateControllerTypes.v1.Query> =
  object({
    workspaceId: number().required(),
  });

export const useUpdateSuperSchema: SuperSchema.Runner<
  UpdateControllerTypes.v1.Params,
  UpdateControllerTypes.v1.Body,
  UpdateControllerTypes.v1.Query
> = defineSuperSchemaRunner(() => {
  return {
    params: paramsSchema,
    body: bodySchema,
    query: querySchema,
  };
});
