import { SuperSchema } from "types/SuperSchema";
import { boolean, number, object, string } from "yup";
import { GetAllControllerTypes } from "types/controllers/Workspace/GetAllController";

import { pageSchema, perPageSchema } from "@schemas/common/paginationSchemas";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchema.Fragment<GetAllControllerTypes.v1.QueryInput> =
  object({
    page: pageSchema.optional(),
    perPage: perPageSchema.optional(),
    ignorePagination: boolean().default(false),
    filters: object()
      .default({})
      .transform(value => JSON.parse(value))
      .required()
      .shape({
        userId: number().optional().min(1),
        name: string().optional().min(1),
      }),
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
