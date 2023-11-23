import { object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { PatchRelativePathControllerTypes } from "types/controllers/File/PatchRelativePathController";

import { Di } from "@enums/Di";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { useRelativePathTest } from "@schemas/common/useRelativePathTest";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const paramsSchema: SuperSchema.Fragment<PatchRelativePathControllerTypes.v1.Params> =
  object({
    id: useIdNumberSchema(Di.FileRepository),
  });

const querySchema: SuperSchema.Fragment<PatchRelativePathControllerTypes.v1.Query> =
  object({
    workspaceId: useIdNumberSchema(Di.WorkspaceRepository),
  });

const bodySchema: SuperSchema.Fragment<PatchRelativePathControllerTypes.v1.Body> =
  object({
    // @TODO check if under relative path there is no already file with similiar name
    relativePath: useRelativePathTest(),
  });

export const usePatchRelativePathSuperSchema: SuperSchema.Runner<
  PatchRelativePathControllerTypes.v1.Params,
  PatchRelativePathControllerTypes.v1.Body,
  PatchRelativePathControllerTypes.v1.Query
> = defineSuperSchemaRunner(() => {
  return {
    query: querySchema,
    params: paramsSchema,
    body: bodySchema,
  };
});
