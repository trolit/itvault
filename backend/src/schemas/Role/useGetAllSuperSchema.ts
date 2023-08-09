import { object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { GetAllControllerTypes } from "types/controllers/Role/GetAllController";

import { pageSchema, perPageSchema } from "@schemas/common/paginationSchemas";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchema.Fragment<GetAllControllerTypes.v1.QueryInput> =
  object({
    page: pageSchema,
    perPage: perPageSchema,
  });

export const useGetAllSuperSchema: SuperSchema.Runner<
  void,
  void,
  GetAllControllerTypes.v1.QueryInput
> = defineSuperSchemaRunner(() => {
  return {
    query: querySchema,
  };
});
