import { SuperSchema } from "types/SuperSchema";
import { array, number, object, string } from "yup";
import { IFileRepository } from "types/repositories/IFileRepository";
import { StoreControllerTypes } from "types/controllers/Bundle/StoreController";

import { Di } from "@enums/Di";
import { AddBundleDto } from "@shared/types/dtos/AddBundleDto";
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

const valueSchema: SuperSchema.Fragment<AddBundleDto> = object({
  blueprintId: number().integer().required(),
  variantIds: array().of(string().required()).required(),
});

const bodySchema: SuperSchema.Fragment<StoreControllerTypes.v1.Body> = object({
  note: string().optional(),
  values: array()
    .of(valueSchema)
    .min(1)
    .required()
    .test(async (values: AddBundleDto[], ctx) => {
      const uniqueVariantIds = getUniqueValuesFromCollection<
        AddBundleDto,
        string
      >(values, "variantIds");

      const fileRepository = getInstanceOf<IFileRepository>(Di.FileRepository);

      const file = await fileRepository.getOneWithMoreThanTwoVariants(
        uniqueVariantIds
      );

      // @TODO validate if amount of provided variantIds MATCH amount of files that are arranged with that blueprint!

      if (file) {
        return ctx.createError({
          message: setYupError(
            CUSTOM_MESSAGES.FILE.VARIANTS_CONFLICT,
            file.originalFilename,
            file.variants.length
          ),
        });
      }

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
