import Zod, { z, RefinementCtx, ZodIssueCode } from "zod";

import { ALL_PERMISSIONS } from "@config/permissions";

import { Di } from "@enums/Di";
import { IRoleRepository } from "@interfaces/repositories/IRoleRepository";
import { AddEditRoleDto, UpdatePermissionDto } from "@dtos/AddEditRoleDto";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { schemaForType } from "@schemas/common/schemaForType";

const permissionSchema = schemaForType<UpdatePermissionDto>()(
  z.object({
    signature: z.string(),
    enabled: z.boolean(),
  })
);

const addEditBodySchema = (id?: number) =>
  schemaForType<AddEditRoleDto>()(
    z.object({
      name: z
        .string()
        .max(15)
        .superRefine(async (value, context: RefinementCtx) => {
          const roleRepository = getInstanceOf<IRoleRepository>(
            Di.RoleRepository
          );

          const role = await roleRepository.getOne({ where: { name: value } });

          if ((!id && role) || (id && role?.id !== id)) {
            context.addIssue({
              code: ZodIssueCode.custom,
              message: `This name is not available.`,
            });

            return Zod.NEVER;
          }
        }),

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
