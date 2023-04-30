import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";

import { ALL_PERMISSIONS } from "@config/permissions";
import { schemaForType } from "@helpers/schemaForType";
import { HEAD_ADMIN_ROLE_ID } from "@config/default-roles";
import { SchemaProvider, SuperSchemaRunner } from "@utils/types";
import { UpdatePermissionDto, UpdateRoleDto } from "@dtos/UpdateRoleDto";

const paramsSchemaProvider: SchemaProvider = () =>
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

const bodySchemaProvider: SchemaProvider = () => {
  const permissionSchema = schemaForType<UpdatePermissionDto>()(
    z.object({
      id: z.number().positive(),
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

const updateRoleSuperSchemaRunner: SuperSchemaRunner = async () => {
  return {
    params: paramsSchemaProvider,
    body: bodySchemaProvider,
  };
};

export const updateSchema = (() => {
  return updateRoleSuperSchemaRunner;
})();
