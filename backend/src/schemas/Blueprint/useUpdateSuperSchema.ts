import { object } from "yup";
import { SuperSchemaElement, SuperSchemaRunner } from "super-schema-types";
import { UpdateControllerTypes } from "types/controllers/Blueprint/UpdateController";

import { useAddEditBodySchema } from "./useAddEditBodySchema";

import { Di } from "@enums/Di";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchemaElement<UpdateControllerTypes.v1.Query> = object({
  workspaceId: useIdNumberSchema(Di.WorkspaceRepository),
});

const paramsSchema: SuperSchemaElement<UpdateControllerTypes.v1.Params> =
  object({
    id: useIdNumberSchema(Di.BlueprintRepository),
  });

export const useUpdateSuperSchema: SuperSchemaRunner<
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
