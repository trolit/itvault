import { object, string } from "yup";
import { SuperSchemaRunner, SuperSchemaElement } from "super-schema-types";
import { PatchFilenameControllerTypes } from "types/controllers/File/PatchFilenameController";

import { Di } from "@enums/Di";
import { IFileRepository } from "@interfaces/repositories/IFileRepository";

import { setYupError } from "@helpers/yup/setError";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const paramsSchema: SuperSchemaElement<PatchFilenameControllerTypes.v1.Params> =
  object({
    id: useIdNumberSchema(Di.FileRepository),
  });

const querySchema: SuperSchemaElement<PatchFilenameControllerTypes.v1.Query> =
  object({
    workspaceId: useIdNumberSchema(Di.WorkspaceRepository),
  });

const useBodySchema: (
  fileId: number,
  workspaceId: number
) => SuperSchemaElement<PatchFilenameControllerTypes.v1.Body> = (
  fileId: number,
  workspaceId: number
) =>
  object({
    filename: string()
      .trim()
      .required()
      .matches(/^[^<>:;,?"*|]+$/)
      .test(async (value: string, ctx) => {
        const fileRepository = getInstanceOf<IFileRepository>(
          Di.FileRepository
        );

        const file = await fileRepository.getById(fileId);

        if (!file) {
          return ctx.createError({
            message: setYupError(CUSTOM_MESSAGES.GENERAL.NOT_AVAILABLE, "File"),
          });
        }

        const fileWithSimiliarName = await fileRepository.getOne({
          where: {
            originalFilename: value,
            workspace: {
              id: workspaceId,
            },
            relativePath: file.relativePath,
          },
        });

        if (fileWithSimiliarName) {
          return ctx.createError({
            message: setYupError(
              CUSTOM_MESSAGES.FILE.DUPLICATE_FILE,
              fileWithSimiliarName.relativePath
            ),
          });
        }

        return true;
      }),
  });

export const usePatchFilenameSuperSchema: SuperSchemaRunner<
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
