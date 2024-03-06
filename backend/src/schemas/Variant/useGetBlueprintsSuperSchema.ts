import { number, object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { GetBlueprintsControllerTypes } from "types/controllers/Variant/GetBlueprintsController";

import { Di } from "@enums/Di";

import { useIdStringSchema } from "@schemas/common/useIdStringSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const paramsSchema: SuperSchema.Fragment<GetBlueprintsControllerTypes.v1.Params> =
  object({
    id: useIdStringSchema(Di.VariantRepository),
  });

const querySchema: SuperSchema.Fragment<GetBlueprintsControllerTypes.v1.Query> =
  object({
    workspaceId: number().required(),
  });

export const useGetBlueprintsSuperSchema: SuperSchema.Runner<
  GetBlueprintsControllerTypes.v1.Params,
  void,
  GetBlueprintsControllerTypes.v1.Query
> = defineSuperSchemaRunner(() => {
  return {
    params: paramsSchema,
    query: querySchema,
  };
});
