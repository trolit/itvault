import { SuperSchema } from "types/SuperSchema";
import { array, boolean, object, string } from "yup";
import { IRoleRepository } from "types/repositories/IRoleRepository";

import { ALL_PERMISSIONS } from "@config/permissions";

import { Di } from "@enums/Di";
import { AddEditRoleDto } from "@shared/types/dtos/AddEditRoleDto";
import { UpdatePermissionDto } from "@shared/types/dtos/UpdatePermissionDto";

import { setYupError } from "@helpers/yup/setError";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

const permissionSchema: SuperSchema.Fragment<UpdatePermissionDto> = object({
  signature: string().required(),

  enabled: boolean().required(),
});

export const useAddEditBodySchema: (
  id?: number
) => SuperSchema.Fragment<AddEditRoleDto> = (id?: number) =>
  object({
    name: string()
      .required()
      .test(async (value, ctx) => {
        const roleRepository = getInstanceOf<IRoleRepository>(
          Di.RoleRepository
        );

        const role = await roleRepository.getOne({ where: { name: value } });

        const isSameName = !id && role;
        const isSameNameButDifferentIds = id && role && role.id !== id;

        if (isSameName || isSameNameButDifferentIds) {
          return ctx.createError({
            message: setYupError(CUSTOM_MESSAGES.GENERAL.NOT_AVAILABLE, "name"),
          });
        }

        return true;
      }),

    permissions: array()
      .of(permissionSchema)
      .required()
      .length(ALL_PERMISSIONS.length)
      .test((value, ctx) => {
        const missingPermissions = ALL_PERMISSIONS.filter(
          ({ signature }) =>
            value.findIndex(
              permission => permission.signature === signature
            ) === -1
        );

        if (missingPermissions.length) {
          for (const { signature, name } of missingPermissions) {
            ctx.createError({
              message: `Permission '${name}' (${signature}) must be provided in request.`,
            });

            ctx.createError({
              message: setYupError(
                CUSTOM_MESSAGES.PERMISSION.MISSING_PERMISSION,
                name,
                signature
              ),
            });
          }

          return false;
        }

        return true;
      }),
  });
