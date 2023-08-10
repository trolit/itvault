import { object, string } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { GetBySlugControllerTypes } from "types/controllers/Workspace/GetBySlugController";

import { Di } from "@enums/Di";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchema.Fragment<GetBySlugControllerTypes.v1.Query> =
  object({
    slug: string().required(),

    workspaceId: useIdNumberSchema(Di.WorkspaceRepository),
  });

export const useGetBySlugSchema: SuperSchema.Runner<
  void,
  void,
  GetBySlugControllerTypes.v1.Query
> = defineSuperSchemaRunner(() => {
  return {
    query: querySchema,
  };
});
