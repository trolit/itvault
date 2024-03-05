import { number, object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { UpdateControllerTypes } from "types/controllers/Blueprint/UpdateController";

import { useAddEditBodySchema } from "./useAddEditBodySchema";

import { Di } from "@enums/Di";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchema.Fragment<UpdateControllerTypes.v1.Query> =
  object({
    workspaceId: number().required(),
  });

const paramsSchema: SuperSchema.Fragment<UpdateControllerTypes.v1.Params> =
  object({
    id: useIdNumberSchema(Di.BlueprintRepository),
  });

export const useUpdateSuperSchema: SuperSchema.Runner<
  UpdateControllerTypes.v1.Params,
  UpdateControllerTypes.v1.Body,
  UpdateControllerTypes.v1.Query
> = defineSuperSchemaRunner(({ request }) => {
  const {
    params: { id },
    query: { workspaceId },
  } = request;

  return {
    query: querySchema,
    params: paramsSchema,
    body: useAddEditBodySchema(workspaceId, id),
  };
});
