import { number, object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { GetAllNotesByIdControllerTypes } from "types/controllers/User/GetAllNotesByIdController";

import { pageSchema } from "@schemas/common/paginationSchemas";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const paramsSchema: SuperSchema.Fragment<GetAllNotesByIdControllerTypes.v1.Params> =
  object({
    id: number()
      .required()
      .transform(value => parseInt(value)),
  });

const querySchema: SuperSchema.Fragment<GetAllNotesByIdControllerTypes.v1.QueryInput> =
  object({
    page: pageSchema,
  });

export const useGetAllNotesByIdSuperSchema: SuperSchema.Runner<
  GetAllNotesByIdControllerTypes.v1.Params,
  void,
  GetAllNotesByIdControllerTypes.v1.QueryInput
> = defineSuperSchemaRunner(() => {
  return {
    params: paramsSchema,
    query: querySchema,
  };
});
