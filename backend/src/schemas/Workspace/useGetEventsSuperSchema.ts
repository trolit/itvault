import { object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { GetEventsControllerTypes } from "types/controllers/Workspace/GetEventsController";

import { Di } from "@enums/Di";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { pageSchema, perPageSchema } from "@schemas/common/paginationSchemas";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchema.Fragment<GetEventsControllerTypes.v1.QueryInput> =
  object({
    page: pageSchema,
    perPage: perPageSchema,
  });

const paramsSchema: SuperSchema.Fragment<GetEventsControllerTypes.v1.Params> =
  object({
    id: useIdNumberSchema(Di.WorkspaceRepository),
  });

export const useGetEventsSuperSchema: SuperSchema.Runner<
  GetEventsControllerTypes.v1.Params,
  void,
  GetEventsControllerTypes.v1.QueryInput
> = defineSuperSchemaRunner(() => {
  return {
    params: paramsSchema,
    query: querySchema,
  };
});
