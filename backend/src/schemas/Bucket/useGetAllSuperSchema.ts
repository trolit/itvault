import { object } from "yup";
import { SuperSchemaElement, SuperSchemaRunner } from "super-schema-types";
import { GetAllControllerTypes } from "types/controllers/Bucket/GetAllController";

import { Di } from "@enums/Di";

import { useIdStringSchema } from "@schemas/common/useIdStringSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchemaElement<GetAllControllerTypes.v1.Query> = object({
  variantId: useIdStringSchema(Di.VariantRepository),
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
