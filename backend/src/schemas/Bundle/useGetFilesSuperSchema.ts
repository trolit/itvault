import { number, object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { GetFilesControllerTypes } from "types/controllers/Bundle/GetFilesController";

import { Di } from "@enums/Di";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const paramsSchema: SuperSchema.Fragment<GetFilesControllerTypes.v1.Params> =
  object({
    id: useIdNumberSchema(Di.BundleRepository),
  });

const querySchema: SuperSchema.Fragment<GetFilesControllerTypes.v1.Query> =
  object({
    workspaceId: number().required(),
    blueprintId: useIdNumberSchema(Di.BlueprintRepository),
  });

export const useGetFilesSuperSchema: SuperSchema.Runner<
  GetFilesControllerTypes.v1.Params,
  void,
  GetFilesControllerTypes.v1.Query
> = defineSuperSchemaRunner(() => {
  return {
    params: paramsSchema,
    query: querySchema,
  };
});
