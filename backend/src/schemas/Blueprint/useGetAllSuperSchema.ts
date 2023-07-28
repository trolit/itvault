import { object } from "yup";
import { SuperSchemaElement, SuperSchemaRunner } from "super-schema-types";
import { GetAllControllerTypes } from "types/controllers/Blueprint/GetAllController";

import { Di } from "@enums/Di";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { pageSchema, perPageSchema } from "@schemas/common/paginationSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchemaElement<GetAllControllerTypes.v1.QueryInput> =
  object({
    page: pageSchema,
    perPage: perPageSchema,
    workspaceId: useIdNumberSchema(Di.WorkspaceRepository),
  });

export const useGetAllSuperSchema: SuperSchemaRunner<
  void,
  void,
  GetAllControllerTypes.v1.QueryInput
> = defineSuperSchemaRunner(() => {
  return {
    query: querySchema,
  };
});
