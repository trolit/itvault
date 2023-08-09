import { number, object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { RequeueControllerTypes } from "types/controllers/Bundle/RequeueController";

import { Di } from "@enums/Di";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchema.Fragment<RequeueControllerTypes.v1.Query> =
  object({
    workspaceId: useIdNumberSchema(Di.WorkspaceRepository),
  });

const paramsSchema: SuperSchema.Fragment<RequeueControllerTypes.v1.Params> =
  object({
    id: number().required().integer(),
  });

export const useRequeueSchema: SuperSchema.Runner<
  RequeueControllerTypes.v1.Params,
  void,
  RequeueControllerTypes.v1.Query
> = defineSuperSchemaRunner(() => {
  return {
    query: querySchema,
    params: paramsSchema,
  };
});
