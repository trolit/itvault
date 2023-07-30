import { object, string } from "yup";
import { SuperSchemaElement } from "super-schema-types";
import { StoreControllerTypes } from "types/controllers/Variant/StoreController";

import { Di } from "@enums/Di";
import { IVariantRepository } from "@interfaces/repositories/IVariantRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { useIdStringSchema } from "@schemas/common/useIdStringSchema";
import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";

export const storeSchema2: SuperSchemaElement<StoreControllerTypes.v1.Body> =
  object({
    name: string()
      .required()
      .when("fileId", ([fileId], schema) => {
        return schema.test(async (value, ctx) => {
          if (!fileId) {
            return ctx.createError({ message: "Must reference file." });
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
            return ctx.createError({ message: "Name must be unique!" });
          }

          return true;
        });
      }),

    fileId: useIdNumberSchema(Di.FileRepository),

    variantId: useIdStringSchema(Di.VariantRepository),
  });
