import { object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { StoreControllerTypes } from "types/controllers/Bucket/StoreController";

import { Di } from "@enums/Di";
import { BucketContent } from "@shared/types/BucketContent";

import { setYupError } from "@helpers/yup/setError";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { useIdStringSchema } from "@schemas/common/useIdStringSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const bodySchema: SuperSchema.Fragment<StoreControllerTypes.v1.Body> = object({
  value: object<BucketContent>().test(
    "has-valid-buckets",
    setYupError(CUSTOM_MESSAGES.BUCKETS.INVALID_CONFIGURATION),
    (data: BucketContent) => {
      for (const [key, value] of Object.entries(data)) {
        const parsedKey = parseInt(key);

        if (!parsedKey) {
          return false;
        }

        if (value.some(text => typeof text !== "string")) {
          return false;
        }
      }

      return true;
    }
  ),
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
