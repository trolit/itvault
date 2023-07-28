import { object } from "yup";
import { SuperSchemaElement, SuperSchemaRunner } from "super-schema-types";
import { StoreControllerTypes } from "types/controllers/Blueprint/StoreController";

import { useAddEditBodySchema } from "./useAddEditBodySchema";

import { Di } from "@enums/Di";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchemaElement<StoreControllerTypes.v1.Query> = object({
  workspaceId: useIdNumberSchema(Di.WorkspaceRepository),
});

export const useStoreSuperSchema: SuperSchemaRunner<
  void,
  StoreControllerTypes.v1.Body,
  StoreControllerTypes.v1.Query
> = defineSuperSchemaRunner(({ request }) => {
  const {
    query: { workspaceId },
  } = request;

  // @NOTE order of key definitions matters
  return {
    query: querySchema,
    body: useAddEditBodySchema(workspaceId),
  };
});
