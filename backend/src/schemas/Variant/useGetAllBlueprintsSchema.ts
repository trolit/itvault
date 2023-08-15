import { object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { GetAllBlueprintsControllerTypes } from "types/controllers/Variant/GetAllBlueprintsController";

import { Di } from "@enums/Di";

import { useIdStringSchema } from "@schemas/common/useIdStringSchema";
import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const paramsSchema: SuperSchema.Fragment<GetAllBlueprintsControllerTypes.v1.Params> =
  object({
    id: useIdStringSchema(Di.VariantRepository),
  });

const querySchema: SuperSchema.Fragment<GetAllBlueprintsControllerTypes.v1.Query> =
  object({
    workspaceId: useIdNumberSchema(Di.WorkspaceRepository),
  });

export const useGetAllBlueprintsSchema: SuperSchema.Runner<
  GetAllBlueprintsControllerTypes.v1.Params,
  void,
  GetAllBlueprintsControllerTypes.v1.Query
> = defineSuperSchemaRunner(() => {
  return {
    params: paramsSchema,
    query: querySchema,
  };
});
