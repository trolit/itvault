import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";

import { Di } from "@enums/Di";
import { IVariantRepository } from "@interfaces/repositories/IVariantRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { schemaForType } from "@schemas/common/schemaForType";

const variantIdSchema = schemaForType<{
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
  variantIdSchema,
};
