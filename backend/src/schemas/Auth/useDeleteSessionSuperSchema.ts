import { object, string } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { DeleteSessionControllerTypes } from "types/controllers/Auth/DeleteSessionController";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const paramsSchema: SuperSchema.Fragment<DeleteSessionControllerTypes.v1.Params> =
  object({
    sessionId: string().required(),
  });

export const useDeleteSessionSuperSchema: SuperSchema.Runner<
  DeleteSessionControllerTypes.v1.Params,
  void,
  void
> = defineSuperSchemaRunner(() => {
  return {
    params: paramsSchema,
  };
});
