import Zod, { z, RefinementCtx, ZodIssueCode } from "zod";

import { ALL_PERMISSIONS } from "@config/permissions";

import { AddEditRoleDto, UpdatePermissionDto } from "@dtos/AddEditRoleDto";

import { schemaForType } from "@schemas/common/schemaForType";

const permissionSchema = schemaForType<UpdatePermissionDto>()(
  z.object({
    signature: z.string(),
    enabled: z.boolean(),
  })
);

const addEditBodySchema = schemaForType<AddEditRoleDto>()(
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

export const baseRoleSchemas = {
  addEditBodySchema,
};
