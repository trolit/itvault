import { In } from "typeorm";
import uniqBy from "lodash/uniqBy";
import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";
import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";

import { Di } from "@enums/Di";
import { BucketDto } from "@dtos/BucketDto";
import { IBlueprintRepository } from "@interfaces/repositories/IBlueprintRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { baseSchemas } from "@schemas/Variant/baseSchemas";
import { schemaForType } from "@schemas/common/schemaForType";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

export const useStoreSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  () => {
    return {
      body: useBodySchema(),
      params: useParamsSchema(),
    };
  }
);

function useParamsSchema(): SchemaProvider {
  return () => baseSchemas.params;
}

function useBodySchema(): SchemaProvider {
  const bucketSchema = schemaForType<BucketDto>()(
    z.object({
      value: z.record(z.coerce.number().gte(0), z.array(z.string())),
      blueprintId: z.number(),
    })
  );

  return () =>
    schemaForType<{ values: BucketDto[] }>()(
      z.object({
        values: z
          .array(bucketSchema)
          .superRefine((value: BucketDto[], context: RefinementCtx) => {
            const uniqueValues = uniqBy(value, element => element.blueprintId);

            if (uniqueValues.length !== value.length) {
              context.addIssue({
                code: ZodIssueCode.custom,
                message: "Blueprints must be unique in each palette value.",
                fatal: true,
              });

              return Zod.NEVER;
            }
          })
          .superRefine(async (value: BucketDto[], context: RefinementCtx) => {
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
}
