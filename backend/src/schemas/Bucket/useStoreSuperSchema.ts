import { SuperSchema } from "types/SuperSchema";
import { array, lazy, object, string } from "yup";
import { StoreControllerTypes } from "types/controllers/Bucket/StoreController";

import { Di } from "@enums/Di";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { useIdStringSchema } from "@schemas/common/useIdStringSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const bodySchema: SuperSchema.Fragment<StoreControllerTypes.v1.Body> = object({
  value: lazy(data => {
    let schema = {};

    Object.keys(data).map(key => {
      schema = { ...schema, [key]: array().of(string()).min(1) };
    });

    return object(schema).required();
  }),
  variantId: useIdStringSchema(Di.VariantRepository),
  blueprintId: useIdNumberSchema(Di.BlueprintRepository),
});

export const useStoreSuperSchema: SuperSchema.Runner<
  void,
  StoreControllerTypes.v1.Body,
  void
> = defineSuperSchemaRunner(() => {
  return {
    body: bodySchema,
  };
});
