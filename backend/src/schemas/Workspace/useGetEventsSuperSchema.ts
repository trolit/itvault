import { number, object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { GetTracesControllerTypes } from "types/controllers/Workspace/GetTracesController";

import { pageSchema, perPageSchema } from "@schemas/common/paginationSchemas";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchema.Fragment<GetTracesControllerTypes.v1.QueryInput> =
  object({
    page: pageSchema,
    perPage: perPageSchema,
  });

const paramsSchema: SuperSchema.Fragment<GetTracesControllerTypes.v1.Params> =
  object({
    id: number().required(),
  });

export const useGetTracesSuperSchema: SuperSchema.Runner<
  GetTracesControllerTypes.v1.Params,
  void,
  GetTracesControllerTypes.v1.QueryInput
> = defineSuperSchemaRunner(() => {
  return {
    params: paramsSchema,
    query: querySchema,
  };
});
