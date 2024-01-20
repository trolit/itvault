import { number, object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { HardDeleteControllerTypes } from "types/controllers/ChatMessage/HardDeleteController";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const paramsSchema: SuperSchema.Fragment<HardDeleteControllerTypes.v1.Params> =
  object({
    id: number().required(),
  });

export const useHardDeleteSuperSchema: SuperSchema.Runner<
  HardDeleteControllerTypes.v1.Params,
  void,
  void
> = defineSuperSchemaRunner(() => {
  return {
    params: paramsSchema,
  };
});
