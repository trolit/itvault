import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";
import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";
import { UpdateControllerTypes } from "types/controllers/Role/UpdateController";

import { HEAD_ADMIN_ROLE_ID } from "@config/default-roles";

import { baseRoleSchemas } from "./baseSchemas";

import { schemaForType } from "@schemas/common/schemaForType";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const { addEditBodySchema } = baseRoleSchemas;

export const useUpdateSuperSchema: SuperSchemaRunner<UpdateControllerTypes.v1.Request> =
  defineSuperSchemaRunner(({ request }) => {
    const {
      params: { id },
    } = request;

    return {
      params: useParamsSchema(),
      body: useBodySchema(id),
    };
  });

function useBodySchema(id: number): SchemaProvider {
  return () => addEditBodySchema(id);
}

function useParamsSchema(): SchemaProvider {
  return () =>
    schemaForType<{ id: number }>()(
      z.object({
        id: z.coerce
          .number()
          .gte(0)
          .superRefine((id, context: RefinementCtx) => {
            if (id === HEAD_ADMIN_ROLE_ID) {
              context.addIssue({
                code: ZodIssueCode.custom,
                message: "This role is not editable.",
              });

              return Zod.NEVER;
            }
          }),
      })
    );
}
