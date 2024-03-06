import { number, object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { GetBucketControllerTypes } from "types/controllers/Variant/GetBucketController";

import { Di } from "@enums/Di";

import { useIdStringSchema } from "@schemas/common/useIdStringSchema";
import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const paramsSchema: SuperSchema.Fragment<GetBucketControllerTypes.v1.Params> =
  object({
    id: useIdStringSchema(Di.VariantRepository),
  });

const querySchema: SuperSchema.Fragment<GetBucketControllerTypes.v1.Query> =
  object({
    workspaceId: number().required(),
    blueprintId: useIdNumberSchema(Di.BlueprintRepository),
  });

export const useGetBucketControllerSuperSchema: SuperSchema.Runner<
  GetBucketControllerTypes.v1.Params,
  void,
  GetBucketControllerTypes.v1.Query
> = defineSuperSchemaRunner(() => {
  return {
    params: paramsSchema,
    query: querySchema,
  };
});
