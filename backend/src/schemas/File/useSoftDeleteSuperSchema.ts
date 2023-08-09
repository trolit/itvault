import { object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { SoftDeleteControllerTypes } from "types/controllers/File/SoftDeleteController";

import { Di } from "@enums/Di";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const paramsSchema: SuperSchema.Fragment<SoftDeleteControllerTypes.v1.Params> =
  object({
    id: useIdNumberSchema(Di.FileRepository),
  });

const querySchema: SuperSchema.Fragment<SoftDeleteControllerTypes.v1.Query> =
  object({
    workspaceId: useIdNumberSchema(Di.WorkspaceRepository),
  });

export const useSoftDeleteSuperSchema: SuperSchema.Runner<
  SoftDeleteControllerTypes.v1.Params,
  void,
  SoftDeleteControllerTypes.v1.Query
> = defineSuperSchemaRunner(() => {
  return {
    query: querySchema,
    params: paramsSchema,
  };
});
