import { In } from "typeorm";
import uniqBy from "lodash/uniqBy";
import { array, number, object } from "yup";
import { SuperSchemaRunner, SuperSchemaElement } from "super-schema-types";
import { StoreManyControllerTypes } from "types/controllers/Bucket/StoreManyController";

import { Di } from "@enums/Di";
import { BucketContent } from "@shared/types/BucketContent";
import { AddBucketDto } from "@shared/types/dtos/AddBucketDto";
import { IBlueprintRepository } from "@interfaces/repositories/IBlueprintRepository";

import { setYupError } from "@helpers/yup/setError";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

import { useIdStringSchema } from "@schemas/common/useIdStringSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const valueSchema: SuperSchemaElement<AddBucketDto> = object({
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
  blueprintId: number().required(),
});

const bodySchema: SuperSchemaElement<StoreManyControllerTypes.v1.Body> = object(
  {
    values: array()
      .of(valueSchema)
      .required()
      .test(
        "has-unique-blueprints",
        setYupError(CUSTOM_MESSAGES.BUCKETS.NO_BLUEPRINTS_SHARING),
        (values: AddBucketDto[]) => {
          const uniqueBlueprintIds = uniqBy(
            values,
            element => element.blueprintId
          );

          return uniqueBlueprintIds.length === values.length;
        }
      )
      .test(
        "has-available-blueprints",
        setYupError(CUSTOM_MESSAGES.BLUEPRINTS.SOME_NOT_AVAILABLE),
        async (values: AddBucketDto[]) => {
          const blueprintRepository = getInstanceOf<IBlueprintRepository>(
            Di.BlueprintRepository
          );

          const uniqueBlueprintIds = values.map(
            ({ blueprintId }) => blueprintId
          );

          const [blueprints] = await blueprintRepository.getAll({
            select: {
              id: true,
            },
            where: {
              id: In(uniqueBlueprintIds),
            },
          });

          return blueprints.length === values.length;
        }
      ),

    variantId: useIdStringSchema(Di.VariantRepository),
  }
);

export const useStoreManySuperSchema: SuperSchemaRunner<
  void,
  StoreManyControllerTypes.v1.Body,
  void
> = defineSuperSchemaRunner(() => {
  return {
    body: bodySchema,
  };
});
