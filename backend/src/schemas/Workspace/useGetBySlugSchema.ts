import { object, string } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { GetBySlugControllerTypes } from "types/controllers/Workspace/GetBySlugController";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const paramsSchema: SuperSchema.Fragment<GetBySlugControllerTypes.v1.Params> =
  object({
    slug: string().required(),
  });

export const useGetBySlugSchema: SuperSchema.Runner<
  GetBySlugControllerTypes.v1.Params,
  void,
  void
> = defineSuperSchemaRunner(() => {
  return {
    params: paramsSchema,
  };
});
