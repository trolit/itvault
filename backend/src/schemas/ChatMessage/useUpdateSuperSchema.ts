import { object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { UpdateControllerTypes } from "types/controllers/ChatMessage/UpdateController";

import { CHAT_MESSAGE_RULES } from "@shared/constants/rules";

import { useTextSchema } from "@schemas/common/useTextSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const bodySchema: SuperSchema.Fragment<UpdateControllerTypes.v1.Body> = object({
  text: useTextSchema(CHAT_MESSAGE_RULES.VALUE.MAX_LENGTH),
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
