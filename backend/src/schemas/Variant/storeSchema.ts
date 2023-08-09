import { object, string } from "yup";
import { SuperSchemaElement } from "super-schema-types";
import { IVariantRepository } from "types/repositories/IVariantRepository";
import { StoreControllerTypes } from "types/controllers/Variant/StoreController";

import { Di } from "@enums/Di";

import { setYupError } from "@helpers/yup/setError";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { useIdStringSchema } from "@schemas/common/useIdStringSchema";

export const storeSchema: SuperSchemaElement<StoreControllerTypes.v1.Body> =
  object({
    name: string()
      .required()
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

    variantId: useIdStringSchema(Di.VariantRepository),
  });
