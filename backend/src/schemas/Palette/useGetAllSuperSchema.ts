import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";

import { Di } from "@enums/Di";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { schemaForType } from "@schemas/common/schemaForType";
import { IVariantRepository } from "@interfaces/repository/IVariantRepository";
import { SuperSchemaRunner, SchemaProvider } from "@custom-types/super-schema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

export const useGetAllSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  () => {
    return {
      params: useParamsSchema(),
    };
  }
);

function useParamsSchema(): SchemaProvider {
  return () =>
    schemaForType<{ variantId: string }>()(
      z.object({
        variantId: z
          .string()
          .superRefine(async (value: string, context: RefinementCtx) => {
            const variantRepository = getInstanceOf<IVariantRepository>(
              Di.VariantRepository
            );

            const variant = await variantRepository.getById(value);

            if (!variant) {
              context.addIssue({
                code: ZodIssueCode.custom,
                message: "Variant is not available.",
              });

              return Zod.NEVER;
            }
          }),
      })
    );
}
