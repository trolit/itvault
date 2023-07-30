import { In } from "typeorm";
import uniqBy from "lodash/uniqBy";
import { array, number, object } from "yup";
import { SuperSchemaRunner, SuperSchemaElement } from "super-schema-types";
import { StoreManyControllerTypes } from "types/controllers/Bucket/StoreManyController";

import { Di } from "@enums/Di";
import { AddBucketDto } from "@dtos/AddBucketDto";
import { BucketContent } from "miscellaneous-types";
import { IBlueprintRepository } from "@interfaces/repositories/IBlueprintRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { useIdStringSchema } from "@schemas/common/useIdStringSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const valueSchema: SuperSchemaElement<AddBucketDto> = object({
  value: object<BucketContent>().test(
    "has-valid-buckets",
    () => "Buckets configuration is invalid!",
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
        () =>
          "Buckets can't share blueprints. Use one bucket per one blueprint.",
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
        () => "One or more blueprints are not available.",
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
