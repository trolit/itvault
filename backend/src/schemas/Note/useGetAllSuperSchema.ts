import { number, object, string } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { GetAllControllerTypes } from "types/controllers/Note/GetAllController";

import { useResourceEntityTest } from "./useResourceEntityTest";

import { Resource } from "@enums/Resource";

import { pageSchema, perPageSchema } from "@schemas/common/paginationSchemas";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchema.Fragment<GetAllControllerTypes.v1.QueryInput> =
  object({
    page: pageSchema,
    perPage: perPageSchema,
    userId: number().optional(),
    id: useResourceEntityTest(),
    resource: string().required().oneOf([Resource.File]),
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
