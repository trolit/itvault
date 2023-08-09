import { object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { GetAllControllerTypes } from "types/controllers/Bucket/GetAllController";

import { Di } from "@enums/Di";

import { useIdStringSchema } from "@schemas/common/useIdStringSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchema.Fragment<GetAllControllerTypes.v1.Query> =
  object({
    variantId: useIdStringSchema(Di.VariantRepository),
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
