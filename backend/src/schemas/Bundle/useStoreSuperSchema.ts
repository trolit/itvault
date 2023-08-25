import { In } from "typeorm";
import uniq from "lodash/uniq";
import { SuperSchema } from "types/SuperSchema";
import { array, number, object, string } from "yup";
import { IFileRepository } from "types/repositories/IFileRepository";
import { StoreControllerTypes } from "types/controllers/Bundle/StoreController";

import { Di } from "@enums/Di";
import { Value } from "@shared/types/dtos/AddBundleDto";
import { BundleExpire } from "@shared/types/enums/BundleExpire";

import { setYupError } from "@helpers/yup/setError";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";
import { getUniqueValuesFromCollection } from "@helpers/getUniqueValuesFromCollection";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchema.Fragment<StoreControllerTypes.v1.Query> = object(
  {
    workspaceId: useIdNumberSchema(Di.WorkspaceRepository),
  }
);

const valueSchema: SuperSchema.Fragment<Value> = object({
  blueprintId: number().integer().required(),
  variantIds: array().of(string().required()).required(),
});

const bodySchema: SuperSchema.Fragment<StoreControllerTypes.v1.Body> = object({
  note: string().optional(),
  values: array()
    .of(valueSchema)
    .min(1)
    .required()
    .test(async (values: Value[], ctx) => {
      const uniqueVariantIds = getUniqueValuesFromCollection<Value, string>(
        values,
        "variantIds"
      );

      const fileRepository = getInstanceOf<IFileRepository>(Di.FileRepository);

      const [files] = await fileRepository.getAll({
        where: {
          variants: {
            id: In(uniqueVariantIds),
          },
        },
        relations: {
          variants: true,
        },
      });

      for (const file of files) {
        const { variants } = file;

        if (variants.length > 1) {
          const fileUniqueVariantIds = uniq(
            variants.map(variant => variant.id)
          );

          if (fileUniqueVariantIds.length > 1) {
            return ctx.createError({
              message: setYupError(
                CUSTOM_MESSAGES.FILE.VARIANTS_CONFLICT,
                file.originalFilename,
                file.variants.length
              ),
            });
          }
        }
      }

      // @TODO validate if amount of provided variantIds MATCH amount of files that are arranged with that blueprint!

      return true;
    }),
  expiration: string().required().oneOf(Object.values(BundleExpire)),
});

export const useStoreSuperSchema: SuperSchema.Runner<
  void,
  StoreControllerTypes.v1.Body,
  StoreControllerTypes.v1.Query
> = defineSuperSchemaRunner(() => {
  return {
    query: querySchema,
    body: bodySchema,
  };
});
