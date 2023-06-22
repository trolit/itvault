import { Di } from "@enums/Di";
import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";

import { getInstanceOf } from "@helpers/getInstanceOf";
import { schemaForType } from "@schemas/common/schemaForType";
import { IVariantRepository } from "types/interfaces/repository/IVariantRepository";

const paramsSchema = schemaForType<{
  variantId: string;
}>()(
  z.object({
    variantId: z.string().superRefine(async (id, context: RefinementCtx) => {
      const variantRepository = getInstanceOf<IVariantRepository>(
        Di.VariantRepository
      );

      const variant = await variantRepository.getById(id);

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

export const baseSchemas = {
  params: paramsSchema,
};
