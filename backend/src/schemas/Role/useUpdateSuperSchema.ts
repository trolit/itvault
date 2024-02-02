import { object } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { UpdateControllerTypes } from "types/controllers/Role/UpdateController";

import { useAddEditBodySchema } from "./useAddEditBodySchema";

import { Di } from "@enums/Di";
import { HEAD_ADMIN_ROLE } from "@shared/constants/config";

import { setYupError } from "@helpers/yup/setError";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const paramsSchema: SuperSchema.Fragment<UpdateControllerTypes.v1.Params> =
  object({
    id: useIdNumberSchema(Di.RoleRepository).test((value, ctx) => {
      if (value === HEAD_ADMIN_ROLE.id) {
        return ctx.createError({
          message: setYupError(CUSTOM_MESSAGES.GENERAL.NOT_EDITABLE, "role"),
        });
      }

      return true;
    }),
  });

export const useUpdateSuperSchema: SuperSchema.Runner<
  UpdateControllerTypes.v1.Params,
  UpdateControllerTypes.v1.Body,
  void
> = defineSuperSchemaRunner(({ request }) => {
  const {
    params: { id },
  } = request;

  return {
    params: paramsSchema,
    body: useAddEditBodySchema(id),
  };
});
