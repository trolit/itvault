import { object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { StoreControllerTypes } from "types/controllers/Blueprint/StoreController";

import { useAddEditBodySchema } from "./useAddEditBodySchema";

import { Di } from "@enums/Di";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchema.Fragment<StoreControllerTypes.v1.Query> = object(
  {
    workspaceId: useIdNumberSchema(Di.WorkspaceRepository),
  }
);

export const useStoreSuperSchema: SuperSchema.Runner<
  void,
  StoreControllerTypes.v1.Body,
  StoreControllerTypes.v1.Query
> = defineSuperSchemaRunner(({ request }) => {
  const {
    query: { workspaceId },
  } = request;

  // @NOTE check 'query' first to make sure that workspaceId is valid
  return {
    query: querySchema,
    body: useAddEditBodySchema(workspaceId),
  };
});
