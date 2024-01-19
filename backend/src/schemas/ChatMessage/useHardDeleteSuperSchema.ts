import { number, object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { HardDeleteControllerTypes } from "types/controllers/ChatMessage/HardDeleteController";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const paramsSchema: SuperSchema.Fragment<HardDeleteControllerTypes.v1.Params> =
  object({
    id: number().required(),
  });

const querySchema: SuperSchema.Fragment<HardDeleteControllerTypes.v1.Query> =
  object({
    workspaceId: number().required(),
  });

export const useHardDeleteSuperSchema: SuperSchema.Runner<
  HardDeleteControllerTypes.v1.Params,
  void,
  HardDeleteControllerTypes.v1.Query
> = defineSuperSchemaRunner(() => {
  return {
    query: querySchema,
    params: paramsSchema,
  };
});
