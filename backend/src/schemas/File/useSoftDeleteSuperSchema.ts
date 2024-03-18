import { number, object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { DeleteControllerTypes } from "types/controllers/File/SoftDeleteController";

import { Di } from "@enums/Di";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const paramsSchema: SuperSchema.Fragment<DeleteControllerTypes.v1.Params> =
  object({
    id: useIdNumberSchema(Di.FileRepository),
  });

const querySchema: SuperSchema.Fragment<DeleteControllerTypes.v1.Query> =
  object({
    workspaceId: number().required(),
  });

export const useSoftDeleteSuperSchema: SuperSchema.Runner<
  DeleteControllerTypes.v1.Params,
  void,
  DeleteControllerTypes.v1.Query
> = defineSuperSchemaRunner(() => {
  return {
    query: querySchema,
    params: paramsSchema,
  };
});
