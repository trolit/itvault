import { number, object } from "yup";
import { SuperSchemaRunner, SuperSchemaElement } from "super-schema-types";
import { GetNotesByIdControllerTypes } from "types/controllers/User/GetNotesByIdController";

import { pageSchema } from "@schemas/common/paginationSchemas";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const paramsSchema: SuperSchemaElement<GetNotesByIdControllerTypes.v1.Params> =
  object({
    id: number()
      .required()
      .transform(value => parseInt(value)),
  });

const querySchema: SuperSchemaElement<GetNotesByIdControllerTypes.v1.QueryInput> =
  object({
    page: pageSchema,
  });

export const useGetNotesByIdSuperSchema: SuperSchemaRunner<
  GetNotesByIdControllerTypes.v1.Params,
  void,
  GetNotesByIdControllerTypes.v1.QueryInput
> = defineSuperSchemaRunner(() => {
  return {
    params: paramsSchema,
    query: querySchema,
  };
});
