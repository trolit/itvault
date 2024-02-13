import { In } from "typeorm";
import uniq from "lodash/uniq";
import { SuperSchema } from "types/SuperSchema";
import { array, number, object, string } from "yup";
import { IFileRepository } from "types/repositories/IFileRepository";
import { AddControllerTypes } from "types/controllers/Bundle/AddController";

import { Di } from "@enums/Di";
import { IAddBundleValueDTO } from "@shared/types/DTOs/Bundle";
import { BundleExpire } from "@shared/types/enums/BundleExpire";

import { setYupError } from "@helpers/yup/setError";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";
import { getUniqueValuesFromCollection } from "@helpers/getUniqueValuesFromCollection";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchema.Fragment<AddControllerTypes.v1.Query> = object({
  workspaceId: number().required(),
});

const valueSchema: SuperSchema.Fragment<IAddBundleValueDTO> = object({
  blueprintId: number().integer().required(),
  variantIds: array().of(string().required()).required(),
});

const bodySchema: SuperSchema.Fragment<AddControllerTypes.v1.Body> = object({
  note: string().optional(),
  values: array()
    .of(valueSchema)
    .min(1)
    .required()
    .test(async (values: IAddBundleValueDTO[], ctx) => {
      const uniqueVariantIds = getUniqueValuesFromCollection<
        IAddBundleValueDTO,
        string
      >(values, "variantIds");

      const fileRepository = getInstanceOf<IFileRepository>(Di.FileRepository);

      const files = await fileRepository.getAll({
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

export const useAddSuperSchema: SuperSchema.Runner<
  void,
  AddControllerTypes.v1.Body,
  AddControllerTypes.v1.Query
> = defineSuperSchemaRunner(() => {
  return {
    query: querySchema,
    body: bodySchema,
  };
});
