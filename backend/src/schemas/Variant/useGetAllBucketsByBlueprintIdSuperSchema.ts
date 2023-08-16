import { object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { GetAllBucketsByBlueprintIdControllerTypes } from "types/controllers/Variant/GetAllBucketsByBlueprintIdController";

import { Di } from "@enums/Di";

import { useIdStringSchema } from "@schemas/common/useIdStringSchema";
import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const paramsSchema: SuperSchema.Fragment<GetAllBucketsByBlueprintIdControllerTypes.v1.Params> =
  object({
    id: useIdStringSchema(Di.VariantRepository),
  });

const querySchema: SuperSchema.Fragment<GetAllBucketsByBlueprintIdControllerTypes.v1.Query> =
  object({
    workspaceId: useIdNumberSchema(Di.WorkspaceRepository),
    blueprintId: useIdNumberSchema(Di.BlueprintRepository),
  });

export const useGetAllBucketsByBlueprintIdSuperSchema: SuperSchema.Runner<
  GetAllBucketsByBlueprintIdControllerTypes.v1.Params,
  void,
  GetAllBucketsByBlueprintIdControllerTypes.v1.Query
> = defineSuperSchemaRunner(() => {
  return {
    params: paramsSchema,
    query: querySchema,
  };
});
