import { object, string } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { DeleteSessionControllerTypes } from "types/controllers/Auth/DeleteSessionController";

import { setYupError } from "@helpers/yup/setError";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const useParamsSchema: (
  sessionId: string
) => SuperSchema.Fragment<DeleteSessionControllerTypes.v1.Params> = sessionId =>
  object({
    id: string()
      .required()
      .notOneOf(
        [sessionId],
        setYupError(CUSTOM_MESSAGES.AUTH.DELETE_OWN_SESSION)
      ),
  });

export const useDeleteSessionSuperSchema: SuperSchema.Runner<
  DeleteSessionControllerTypes.v1.Params,
  void,
  void
> = defineSuperSchemaRunner(({ request: { sessionId } }) => {
  return {
    params: useParamsSchema(sessionId),
  };
});
