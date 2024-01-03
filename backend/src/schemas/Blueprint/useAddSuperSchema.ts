import { object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { AddControllerTypes } from "types/controllers/Blueprint/AddController";

import { useAddEditBodySchema } from "./useAddEditBodySchema";

import { Di } from "@enums/Di";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchema.Fragment<AddControllerTypes.v1.Query> = object({
  workspaceId: useIdNumberSchema(Di.WorkspaceRepository),
});

export const useAddSuperSchema: SuperSchema.Runner<
  void,
  AddControllerTypes.v1.Body,
  AddControllerTypes.v1.Query
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
