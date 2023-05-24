import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";

import { ALL_PERMISSIONS } from "@config/permissions";
import { HEAD_ADMIN_ROLE_ID } from "@config/default-roles";
import { schemaForType } from "@schemas/common/schemaForType";
import type { UpdatePermissionDto, UpdateRoleDto } from "@dtos/UpdateRoleDto";
import { SuperSchemaRunner, SchemaProvider } from "@custom-types/super-schema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

export const updateSchema: SuperSchemaRunner = defineSuperSchemaRunner(() => {
  return {
    body: useBodySchema(),
    params: useParamsSchema(),
  };
});

function useBodySchema(): SchemaProvider {
  return () => {
    const permissionSchema = schemaForType<UpdatePermissionDto>()(
      z.object({
        id: z.number().gt(0),
        enabled: z.boolean(),
      })
    );

    return schemaForType<UpdateRoleDto>()(
      z.object({
        name: z.string().max(15),
        permissions: z
          .array(permissionSchema)
          .nonempty()
          .length(ALL_PERMISSIONS.length)
          .superRefine((permissions, context: RefinementCtx) => {
            const missingPermissions = ALL_PERMISSIONS.filter(
              ({ id }) =>
                permissions.findIndex(permission => permission.id === id) === -1
            );

            if (missingPermissions.length) {
              for (const { id, name } of missingPermissions) {
                context.addIssue({
                  code: ZodIssueCode.custom,
                  message: `Permission '${name}' (${id}) must be provided in request.`,
                });
              }

              return Zod.NEVER;
            }
          }),
      })
    );
  };
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
