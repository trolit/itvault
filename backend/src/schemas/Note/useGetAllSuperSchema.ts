import { number, object, string } from "yup";
import { SuperSchemaRunner, SuperSchemaElement } from "super-schema-types";
import { GetAllControllerTypes } from "types/controllers/Note/GetAllController";

import { useResourceEntityTest } from "./useResourceEntityTest";

import { Resource } from "@enums/Resource";

import { pageSchema, perPageSchema } from "@schemas/common/paginationSchemas";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchemaElement<GetAllControllerTypes.v1.QueryInput> =
  object({
    page: pageSchema,
    perPage: perPageSchema,
    userId: number().optional(),
    id: useResourceEntityTest(),
    resource: string().required().oneOf([Resource.File]),
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
