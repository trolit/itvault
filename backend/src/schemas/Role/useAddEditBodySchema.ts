import { Not } from "typeorm";
import sanitizeHtml from "sanitize-html";
import { SuperSchema } from "types/SuperSchema";
import { array, boolean, object, string } from "yup";
import { IRoleRepository } from "types/repositories/IRoleRepository";

import { PERMISSIONS_AS_ARRAY } from "@config/permissions";

import { Di } from "@enums/Di";
import { IAddEditRoleDTO } from "@shared/types/DTOs/Role";
import { IPermissionUpdateDTO } from "@shared/types/DTOs/Permission";

import { setYupError } from "@helpers/yup/setError";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

const permissionSchema: SuperSchema.Fragment<IPermissionUpdateDTO> = object({
  signature: string().required(),

  enabled: boolean().required(),
});

export const useAddEditBodySchema: (
  id?: number
) => SuperSchema.Fragment<IAddEditRoleDTO> = (id?: number) =>
  object({
    name: string()
      .required()
      .test(async (value, ctx) => {
        const roleRepository = getInstanceOf<IRoleRepository>(
          Di.RoleRepository
        );

        const idQuery = id ? { id: Not(id) } : {};

        const role = await roleRepository.getOne({
          where: { ...idQuery, name: value },
        });

        if (role) {
          return ctx.createError({
            message: setYupError(CUSTOM_MESSAGES.GENERAL.NOT_AVAILABLE, "name"),
          });
        }

        return true;
      }),

    description: string()
      .defined()
      .transform(value => sanitizeHtml(value))
      .max(255),

    permissions: array()
      .of(permissionSchema)
      .required()
      .length(PERMISSIONS_AS_ARRAY.length)
      .test((value, ctx) => {
        const missingPermissions = PERMISSIONS_AS_ARRAY.filter(
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
