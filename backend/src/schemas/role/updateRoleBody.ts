import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";

import { SuperSchemaRunner } from "@utils/types";
import { schemaForType } from "@helpers/schemaForType";
import { UpdatePermissionDto, UpdateRoleDto } from "@dtos/UpdateRoleDto";
import { ALL_PERMISSIONS } from "@config/permissions";

const updateRoleBodySchemaRunner: SuperSchemaRunner = () => {
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
                message: `Missing permission ${name} (${id}).`,
              });
            }

            return Zod.NEVER;
          }
        }),
    })
  );
};

export const updateRoleBodySchema = (() => {
  return updateRoleBodySchemaRunner;
})();
