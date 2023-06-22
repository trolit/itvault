import { In } from "typeorm";
import uniqBy from "lodash/uniqBy";
import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";

import { Di } from "types/enums/Di";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { StorePaletteDto } from "@dtos/StorePaletteDto";
import { baseSchemas } from "@schemas/Variant/baseSchemas";
import { schemaForType } from "@schemas/common/schemaForType";
import { SuperSchemaRunner, SchemaProvider } from "@custom-types/super-schema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";
import { IBlueprintRepository } from "@interfaces/repository/IBlueprintRepository";

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
  const paletteSchema = schemaForType<StorePaletteDto>()(
    z.object({
      value: z.record(z.coerce.number().gte(0), z.array(z.string())),
      blueprintId: z.number(),
    })
  );

  return () =>
    schemaForType<{ values: StorePaletteDto[] }>()(
      z.object({
        values: z
          .array(paletteSchema)
          .superRefine((value: StorePaletteDto[], context: RefinementCtx) => {
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
          .superRefine(
            async (value: StorePaletteDto[], context: RefinementCtx) => {
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
            }
          ),
      })
    );
}
