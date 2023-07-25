import { In } from "typeorm";
import uniqBy from "lodash/uniqBy";
import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";
import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";

import { Di } from "@enums/Di";
import { AddBucketDto } from "@dtos/AddBucketDto";
import { IBlueprintRepository } from "@interfaces/repositories/IBlueprintRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { schemaForType } from "@schemas/common/schemaForType";
import { baseVariantSchemas } from "@schemas/Variant/baseSchemas";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const { variantIdSchema } = baseVariantSchemas;

export const useStoreManySuperSchema: SuperSchemaRunner =
  defineSuperSchemaRunner(() => {
    return {
      body: useBodySchema(),
    };
  });

function useBodySchema(): SchemaProvider {
  const bucketSchema = schemaForType<AddBucketDto>()(
    z.object({
      value: z.record(z.coerce.number().gte(0), z.array(z.string())),
      blueprintId: z.number(),
    })
  );

  const valuesSchema = schemaForType<{ values: AddBucketDto[] }>()(
    z.object({
      values: z
        .array(bucketSchema)
        .superRefine((value: AddBucketDto[], context: RefinementCtx) => {
          const uniqueValues = uniqBy(value, element => element.blueprintId);

          if (uniqueValues.length !== value.length) {
            context.addIssue({
              code: ZodIssueCode.custom,
              message:
                "Buckets can't share blueprints. Use one bucket per one blueprint.",
              fatal: true,
            });

            return Zod.NEVER;
          }
        })
        .superRefine(async (value: AddBucketDto[], context: RefinementCtx) => {
          const blueprintRepository = getInstanceOf<IBlueprintRepository>(
            Di.BlueprintRepository
          );

          const uniqueBlueprintIds = value.map(
            ({ blueprintId }) => blueprintId
          );

          const [blueprints] = await blueprintRepository.getAll({
            where: {
              id: In(uniqueBlueprintIds),
            },
          });

          if (blueprints.length !== value.length) {
            context.addIssue({
              code: ZodIssueCode.custom,
              message:
                "Failed to process request as one or more blueprints are not available.",
            });

            return Zod.NEVER;
          }
        }),
    })
  );

  return () => variantIdSchema.merge(valuesSchema);
}
