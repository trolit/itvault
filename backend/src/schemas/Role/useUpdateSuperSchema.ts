import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";
import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";

import { ALL_PERMISSIONS } from "@config/permissions";
import { HEAD_ADMIN_ROLE_ID } from "@config/default-roles";

import type { UpdatePermissionDto, UpdateRoleDto } from "@dtos/UpdateRoleDto";

import { schemaForType } from "@schemas/common/schemaForType";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

export const useUpdateSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  () => {
    return {
      body: useBodySchema(),
      params: useParamsSchema(),
    };
  }
);

function useBodySchema(): SchemaProvider {
  return () => {
    const permissionSchema = schemaForType<UpdatePermissionDto>()(
      z.object({
        signature: z.string(),
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
              ({ signature }) =>
                permissions.findIndex(
                  permission => permission.signature === signature
                ) === -1
            );

            if (missingPermissions.length) {
              for (const { signature, name } of missingPermissions) {
                context.addIssue({
                  code: ZodIssueCode.custom,
                  message: `Permission '${name}' (${signature}) must be provided in request.`,
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
