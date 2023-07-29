import { object } from "yup";
import { SuperSchemaRunner, SuperSchemaElement } from "super-schema-types";
import { UpdateControllerTypes } from "types/controllers/Role/UpdateController";

import { HEAD_ADMIN_ROLE_ID } from "@config/default-roles";

import { useAddEditBodySchema } from "./useAddEditBodySchema";

import { Di } from "@enums/Di";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const paramsSchema: SuperSchemaElement<UpdateControllerTypes.v1.Params> =
  object({
    id: useIdNumberSchema(Di.RoleRepository).test((value, ctx) => {
      if (value === HEAD_ADMIN_ROLE_ID) {
        return ctx.createError({ message: "This role is not editable." });
      }

      return true;
    }),
  });

export const useUpdateSuperSchema: SuperSchemaRunner<
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
