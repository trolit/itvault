import { number, object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { MoveFilesControllerTypes } from "types/controllers/Directory/MoveFilesController";

import { Di } from "@enums/Di";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchema.Fragment<MoveFilesControllerTypes.v1.Query> =
  object({
    workspaceId: number().required(),
  });

const bodySchema: SuperSchema.Fragment<MoveFilesControllerTypes.v1.Body> =
  object({
    sourceDirectoryId: number()
      .required()
      .isEntityAvailable(Di.DirectoryRepository, id => ({
        id,
      })),
    targetDirectoryId: number()
      .required()
      .isEntityAvailable(Di.DirectoryRepository, id => ({
        id,
      })),
  });

export const useMoveFilesSuperSchema: SuperSchema.Runner<
  void,
  MoveFilesControllerTypes.v1.Body,
  MoveFilesControllerTypes.v1.Query
> = defineSuperSchemaRunner(() => {
  return {
    query: querySchema,
    body: bodySchema,
  };
});
