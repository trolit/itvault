import { array, number, object, string } from "yup";
import { SuperSchemaRunner, SuperSchemaElement } from "super-schema-types";
import { StoreControllerTypes } from "types/controllers/Bundle/StoreController";

import { Di } from "@enums/Di";
import { AddBundleDto } from "@dtos/AddBundleDto";
import { BundleExpire } from "@enums/BundleExpire";
import { IFileRepository } from "@interfaces/repositories/IFileRepository";

import { MESSAGES } from "@helpers/yup/messages";
import { setYupError } from "@helpers/yup/setError";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { getUniqueValuesFromCollection } from "@helpers/getUniqueValuesFromCollection";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchemaElement<StoreControllerTypes.v1.Query> = object({
  workspaceId: useIdNumberSchema(Di.WorkspaceRepository),
});

const valueSchema: SuperSchemaElement<AddBundleDto> = object({
  blueprintId: number().integer().required(),
  variantIds: array().of(string().required()).required(),
});

const bodySchema: SuperSchemaElement<StoreControllerTypes.v1.Body> = object({
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

      if (file) {
        return ctx.createError({
          message: setYupError(
            MESSAGES.FILE.VARIANTS_CONFLICT,
            file.originalFilename,
            file.variants.length
          ),
        });
      }

      return true;
    }),
  expiration: string().required().oneOf(Object.values(BundleExpire)),
});

export const useStoreSuperSchema: SuperSchemaRunner<
  void,
  StoreControllerTypes.v1.Body,
  StoreControllerTypes.v1.Query
> = defineSuperSchemaRunner(() => {
  return {
    query: querySchema,
    body: bodySchema,
  };
});
