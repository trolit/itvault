import { object, string } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { IVariantRepository } from "types/repositories/IVariantRepository";
import { AddControllerTypes } from "types/controllers/Variant/AddController";

import { Di } from "@enums/Di";
import { VARIANT_RULES } from "@shared/constants/rules";

import { setYupError } from "@helpers/yup/setError";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";

export const addSchema: SuperSchema.Fragment<AddControllerTypes.v1.Body> =
  object({
    name: string()
      .trim()
      .required()
      .min(VARIANT_RULES.NAME.MIN_LENGTH)
      .when("fileId", ([fileId], schema) => {
        return schema.test(async (value, ctx) => {
          if (!fileId) {
            return ctx.createError({
              message: setYupError(CUSTOM_MESSAGES.VARIANT.MUST_REFERENCE_FILE),
            });
          }

          const variantRepository = getInstanceOf<IVariantRepository>(
            Di.VariantRepository
          );

          const variant = await variantRepository.getOne({
            where: {
              name: value,
              file: {
                id: fileId,
              },
            },
          });

          if (variant) {
            return ctx.createError({
              message: setYupError(CUSTOM_MESSAGES.GENERAL.UNIQUE, "Name"),
            });
          }

          return true;
        });
      }),

    fileId: useIdNumberSchema(Di.FileRepository),
  });
