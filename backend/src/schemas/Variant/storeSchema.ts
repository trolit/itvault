import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";

import { Di } from "@enums/Di";
import { IFileRepository } from "@interfaces/repositories/IFileRepository";
import { IVariantRepository } from "@interfaces/repositories/IVariantRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { schemaForType } from "@schemas/common/schemaForType";

import { IBody } from "@controllers/Variant/StoreController";

export const fieldsSchema = schemaForType<IBody>()(
  z.object({
    // @TODO check if name is unique
    name: z.string().min(2),

    fileId: z.coerce
      .number()
      .gt(0)
      .superRefine(async (id, context: RefinementCtx) => {
        if (id <= 0) {
          return Zod.NEVER;
        }

        const fileRepository = getInstanceOf<IFileRepository>(
          Di.FileRepository
        );

        const file = await fileRepository.getById(id);

        if (!file) {
          context.addIssue({
            code: ZodIssueCode.custom,
            message: "File is not available.",
          });

          return Zod.NEVER;
        }
      }),

    variantId: z.optional(
      z.string().superRefine(async (id, context: RefinementCtx) => {
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
      })
    ),
  })
);

export const storeSchema = { fields: fieldsSchema };
