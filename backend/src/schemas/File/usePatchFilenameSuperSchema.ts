import { object, string } from "yup";
import { SuperSchemaRunner, SuperSchemaElement } from "super-schema-types";
import { PatchFilenameControllerTypes } from "types/controllers/File/PatchFilenameController";

import { Di } from "@enums/Di";
import { IFileRepository } from "@interfaces/repositories/IFileRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const paramsSchema: SuperSchemaElement<PatchFilenameControllerTypes.v1.Params> =
  object({
    fileId: useIdNumberSchema(Di.FileRepository),
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
            message: "File is not available.",
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
            message: "There is already file with such name under given dir.",
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
    params: { fileId },
    query: { workspaceId },
  } = request;

  return {
    query: querySchema,
    params: paramsSchema,
    body: useBodySchema(fileId, workspaceId),
  };
});
