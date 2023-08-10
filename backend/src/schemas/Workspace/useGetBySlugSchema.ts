import { object, string } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { GetBySlugControllerTypes } from "types/controllers/Workspace/GetBySlugController";

import { Di } from "@enums/Di";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const paramsSchema: SuperSchema.Fragment<GetBySlugControllerTypes.v1.Params> =
  object({
    slug: string().required(),
  });

const querySchema: SuperSchema.Fragment<GetBySlugControllerTypes.v1.Query> =
  object({
    workspaceId: useIdNumberSchema(Di.WorkspaceRepository),
  });

export const useGetBySlugSchema: SuperSchema.Runner<
  GetBySlugControllerTypes.v1.Params,
  void,
  GetBySlugControllerTypes.v1.Query
> = defineSuperSchemaRunner(() => {
  return {
    params: paramsSchema,
    query: querySchema,
  };
});
