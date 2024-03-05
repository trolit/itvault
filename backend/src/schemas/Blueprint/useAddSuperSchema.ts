import { number, object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { AddControllerTypes } from "types/controllers/Blueprint/AddController";

import { useAddEditBodySchema } from "./useAddEditBodySchema";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchema.Fragment<AddControllerTypes.v1.Query> = object({
  workspaceId: number().required(),
});

export const useAddSuperSchema: SuperSchema.Runner<
  void,
  AddControllerTypes.v1.Body,
  AddControllerTypes.v1.Query
> = defineSuperSchemaRunner(({ request }) => {
  const {
    query: { workspaceId },
  } = request;

  return {
    query: querySchema,
    body: useAddEditBodySchema(workspaceId),
  };
});
