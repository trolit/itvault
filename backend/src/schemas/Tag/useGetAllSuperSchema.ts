import { object, string } from "yup";
import { SuperSchemaRunner, SuperSchemaElement } from "super-schema-types";
import { GetAllControllerTypes } from "types/controllers/Tag/GetAllController";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchemaElement<GetAllControllerTypes.v1.Query> = object({
  search: string().optional(),
});

export const useGetAllSuperSchema: SuperSchemaRunner<
  void,
  void,
  GetAllControllerTypes.v1.Query
> = defineSuperSchemaRunner(() => {
  return {
    query: querySchema,
  };
});
