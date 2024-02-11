import { number, object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { GetContributorsControllerTypes } from "types/controllers/Workspace/GetContributorsController";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const paramsSchema: SuperSchema.Fragment<GetContributorsControllerTypes.v1.Params> =
  object({
    id: number().required(),
  });

export const useGetContributorsSuperSchema: SuperSchema.Runner<
  GetContributorsControllerTypes.v1.Params,
  void,
  void
> = defineSuperSchemaRunner(() => {
  return {
    params: paramsSchema,
  };
});
