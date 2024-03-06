import { number, object, string } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { IVariantRepository } from "types/repositories/IVariantRepository";
import { PatchNameControllerTypes } from "types/controllers/Variant/PatchNameController";

import { Di } from "@enums/Di";

import { setYupError } from "@helpers/yup/setError";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

import { useIdStringSchema } from "@schemas/common/useIdStringSchema";
import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const paramsSchema: SuperSchema.Fragment<PatchNameControllerTypes.v1.Params> =
  object({
    id: useIdStringSchema(Di.VariantRepository),
  });

const querySchema: SuperSchema.Fragment<PatchNameControllerTypes.v1.Query> =
  object({
    workspaceId: number().required(),

    fileId: useIdNumberSchema(Di.FileRepository),
  });

const useBodySchema: (
  fileId: number
) => SuperSchema.Fragment<PatchNameControllerTypes.v1.Body> = (
  fileId: number
) =>
  object({
    name: string()
      .trim()
      .required()
      .test(async (value: string, ctx) => {
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
            message: setYupError(CUSTOM_MESSAGES.GENERAL.NOT_AVAILABLE, "Name"),
          });
        }

        return true;
      }),
  });

export const usePatchNameSuperSchema: SuperSchema.Runner<
  PatchNameControllerTypes.v1.Params,
  PatchNameControllerTypes.v1.Body,
  PatchNameControllerTypes.v1.Query
> = defineSuperSchemaRunner(({ request }) => {
  const {
    query: { fileId },
  } = request;

  return {
    query: querySchema,
    params: paramsSchema,
    body: useBodySchema(fileId),
  };
});
