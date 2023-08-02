import { number, object } from "yup";
import { SuperSchemaRunner, SuperSchemaElement } from "super-schema-types";
import { GetAllNotesByIdControllerTypes } from "types/controllers/User/GetAllNotesByIdController";

import { pageSchema } from "@schemas/common/paginationSchemas";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const paramsSchema: SuperSchemaElement<GetAllNotesByIdControllerTypes.v1.Params> =
  object({
    id: number()
      .required()
      .transform(value => parseInt(value)),
  });

const querySchema: SuperSchemaElement<GetAllNotesByIdControllerTypes.v1.QueryInput> =
  object({
    page: pageSchema,
  });

export const useGetNotesByIdSuperSchema: SuperSchemaRunner<
  GetAllNotesByIdControllerTypes.v1.Params,
  void,
  GetAllNotesByIdControllerTypes.v1.QueryInput
> = defineSuperSchemaRunner(() => {
  return {
    params: paramsSchema,
    query: querySchema,
  };
});
