import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";
import { StoreControllerTypes } from "types/controllers/Variant/StoreController";

import { Di } from "@enums/Di";
import { IFileRepository } from "@interfaces/repositories/IFileRepository";
import { IVariantRepository } from "@interfaces/repositories/IVariantRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { schemaForType } from "@schemas/common/schemaForType";

const variantRepository = getInstanceOf<IVariantRepository>(
  Di.VariantRepository
);

export const fieldsSchema = schemaForType<StoreControllerTypes.v1.Body>()(
  z
    .object({
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
    .superRefine(
      async (value: StoreControllerTypes.v1.Body, context: RefinementCtx) => {
        const { name, fileId } = value;

        const variant = await variantRepository.getOne({
          where: {
            name,
            file: {
              id: fileId,
            },
          },
        });

        if (variant) {
          context.addIssue({
            code: ZodIssueCode.custom,
            message: "Name must be unique!",
          });

          return Zod.NEVER;
        }
      }
    )
);

export const storeSchema = { fields: fieldsSchema };
