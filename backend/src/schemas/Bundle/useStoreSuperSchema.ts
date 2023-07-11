import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";
import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";

import { Di } from "@enums/Di";
import { BundleDto } from "@dtos/BundleDto";
import { BundleExpire } from "@enums/BundleExpire";
import { IFileRepository } from "@interfaces/repositories/IFileRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { schemaForType } from "@schemas/common/schemaForType";
import { baseWorkspaceSchemas } from "@schemas/Workspace/baseSchemas";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

import { IBody } from "@controllers/Bundle/StoreController";

const { workspaceIdSchema } = baseWorkspaceSchemas;

export const useStoreSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  () => {
    return {
      query: useQuerySchema(),
      body: useBodySchema(),
    };
  }
);

function useQuerySchema(): SchemaProvider {
  return () => workspaceIdSchema;
}

function useBodySchema(): SchemaProvider {
  const valueSchema = schemaForType<BundleDto>()(
    z.object({
      blueprintId: z.coerce.number(),
      variantIds: z.array(z.string()),
    })
  );

  const bodySchema = schemaForType<IBody>()(
    z.object({
      note: z.optional(z.string()),
      expiration: z.nativeEnum(BundleExpire),
      values: z
        .array(valueSchema)
        .min(1)
        .superRefine(async (value: BundleDto[], context: RefinementCtx) => {
          if (value.length <= 1) {
            return Zod.NEVER;
          }

          const uniqueVariantIds: string[] = [];

          value.map(({ variantIds }) => {
            variantIds.map(variantId =>
              uniqueVariantIds.includes(variantId)
                ? null
                : uniqueVariantIds.push(variantId)
            );
          });

          const fileRepository = getInstanceOf<IFileRepository>(
            Di.FileRepository
          );

          const file = await fileRepository.getOneWithMoreThanTwoVariants(
            uniqueVariantIds
          );

          if (file) {
            context.addIssue({
              code: ZodIssueCode.custom,
              message: `File ${file.originalFilename} was selected with ${file.variants.length} different variants. To avoid conflicts, please update your configuration to use only one variant.`,
            });

            return Zod.NEVER;
          }
        }),
    })
  );

  return () => bodySchema;
}
