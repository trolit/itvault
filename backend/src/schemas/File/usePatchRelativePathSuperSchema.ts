import { number, object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { IFileRepository } from "types/repositories/IFileRepository";
import { PatchRelativePathControllerTypes } from "types/controllers/File/PatchRelativePathController";

import { Di } from "@enums/Di";

import { setYupError } from "@helpers/yup/setError";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

import { useRelativePathTest } from "@schemas/common/useRelativePathTest";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const paramsSchema: SuperSchema.Fragment<PatchRelativePathControllerTypes.v1.Params> =
  object({
    id: number().required(),
  });

const querySchema: SuperSchema.Fragment<PatchRelativePathControllerTypes.v1.Query> =
  object({
    workspaceId: number().required(),
  });

const useBodySchema: (
  id: number
) => SuperSchema.Fragment<PatchRelativePathControllerTypes.v1.Body> = (
  id: number
) =>
  object({
    relativePath: useRelativePathTest().test(async (value: string, ctx) => {
      const fileRepository = getInstanceOf<IFileRepository>(Di.FileRepository);

      const file = await fileRepository.getOne({
        where: { id },
      });

      if (!file) {
        return ctx.createError({
          message: setYupError(
            CUSTOM_MESSAGES.GENERAL.NOT_AVAILABLE,
            `file (ref: ${id})`
          ),
        });
      }

      const fileAtRelativePath = await fileRepository.getOne({
        where: {
          originalFilename: file.originalFilename,
          directory: { relativePath: value },
        },
      });

      if (fileAtRelativePath) {
        return ctx.createError({
          message: setYupError(CUSTOM_MESSAGES.FILE.DUPLICATE, value),
        });
      }

      return true;
    }),
  });

export const usePatchRelativePathSuperSchema: SuperSchema.Runner<
  PatchRelativePathControllerTypes.v1.Params,
  PatchRelativePathControllerTypes.v1.Body,
  PatchRelativePathControllerTypes.v1.Query
> = defineSuperSchemaRunner(({ request }) => {
  const {
    params: { id },
  } = request;

  return {
    query: querySchema,
    params: paramsSchema,
    body: useBodySchema(id),
  };
});
