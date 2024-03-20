import { number, object, string } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { IFileRepository } from "types/repositories/IFileRepository";
import { PatchFilenameControllerTypes } from "types/controllers/File/PatchFilenameController";

import { Di } from "@enums/Di";
import { FILE_RULES } from "@shared/constants/rules";

import { setYupError } from "@helpers/yup/setError";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const { FILENAME } = FILE_RULES;

const paramsSchema: SuperSchema.Fragment<PatchFilenameControllerTypes.v1.Params> =
  object({
    id: useIdNumberSchema(Di.FileRepository),
  });

const querySchema: SuperSchema.Fragment<PatchFilenameControllerTypes.v1.Query> =
  object({
    workspaceId: number().required(),
  });

const useBodySchema: (
  fileId: number,
  workspaceId: number
) => SuperSchema.Fragment<PatchFilenameControllerTypes.v1.Body> = (
  fileId: number,
  workspaceId: number
) =>
  object({
    filename: string()
      .trim()
      .required()
      .matches(FILENAME.REGEX)
      .test(async (value: string, ctx) => {
        const fileRepository = getInstanceOf<IFileRepository>(
          Di.FileRepository
        );

        const file = await fileRepository.getOne({
          where: { id: fileId },
          relations: { directory: true },
        });

        if (!file) {
          return ctx.createError({
            message: setYupError(CUSTOM_MESSAGES.GENERAL.NOT_AVAILABLE, "File"),
          });
        }

        const { relativePath } = file.directory;

        const fileWithSimiliarName = await fileRepository.getOne({
          where: {
            originalFilename: value,
            workspace: {
              id: workspaceId,
            },
            directory: {
              relativePath,
            },
          },
        });

        if (fileWithSimiliarName) {
          return ctx.createError({
            message: setYupError(
              CUSTOM_MESSAGES.FILE.DUPLICATE_FILE,
              relativePath
            ),
          });
        }

        return true;
      }),
  });

export const usePatchFilenameSuperSchema: SuperSchema.Runner<
  PatchFilenameControllerTypes.v1.Params,
  PatchFilenameControllerTypes.v1.Body,
  PatchFilenameControllerTypes.v1.Query
> = defineSuperSchemaRunner(({ request }) => {
  const {
    params: { id },
    query: { workspaceId },
  } = request;

  return {
    query: querySchema,
    params: paramsSchema,
    body: useBodySchema(id, workspaceId),
  };
});
