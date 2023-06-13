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
      query: useQuerySchema(),
    };
  }
);

function useQuerySchema(): SchemaProvider {
  return () =>
    schemaForType<{ variantId: number }>()(
      z.object({
        variantId: z
          .number()
          .gt(0)
          .superRefine(async (value: number, context: RefinementCtx) => {
            if (value <= 0) {
              return Zod.NEVER;
            }

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
