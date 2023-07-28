import { number, object } from "yup";
import { SuperSchemaElement, SuperSchemaRunner } from "super-schema-types";
import { StoreControllerTypes } from "types/controllers/Blueprint/StoreController";

import { useAddEditBodySchema } from "./useAddEditBodySchema";

import { Di } from "@enums/Di";
import { Workspace } from "@entities/Workspace";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchemaElement<StoreControllerTypes.v1.Query> = object({
  workspaceId: number()
    .required()
    .integer()
    .isEntityAvailable<Workspace>(Di.WorkspaceRepository, value => ({
      id: value,
    })),
});

export const useStoreSuperSchema: SuperSchemaRunner<
  void,
  StoreControllerTypes.v1.Body,
  StoreControllerTypes.v1.Query
> = defineSuperSchemaRunner(({ request }) => {
  const {
    query: { workspaceId },
  } = request;

  return {
    query: querySchema,
    body: useAddEditBodySchema(workspaceId),
  };
});
