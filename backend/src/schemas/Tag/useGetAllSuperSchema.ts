import { object, string } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { GetAllControllerTypes } from "types/controllers/Tag/GetAllController";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchema.Fragment<GetAllControllerTypes.v1.Query> =
  object({
    search: string().optional(),
  });

export const useGetAllSuperSchema: SuperSchema.Runner<
  void,
  void,
  GetAllControllerTypes.v1.Query
> = defineSuperSchemaRunner(() => {
  return {
    query: querySchema,
  };
});
