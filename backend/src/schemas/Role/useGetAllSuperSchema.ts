import { object, string } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { GetAllControllerTypes } from "types/controllers/Role/GetAllController";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";
import {
  pageSchemaV2,
  perPageSchemaV2,
} from "@schemas/common/paginationSchemas";

const querySchema: SuperSchema.Fragment<GetAllControllerTypes.v1.QueryInput> =
  object({
    page: pageSchemaV2,
    perPage: perPageSchemaV2,
    // @TODO -> create "q" object or smth
    name: string().when(["page", "perPage"], {
      is: (page: number, perPage: number) => !page && !perPage,
      then: schema => schema.required(),
      otherwise: schema => schema.optional(),
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
