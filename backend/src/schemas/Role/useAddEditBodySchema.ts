import { array, boolean, object, string } from "yup";
import { SuperSchemaElement } from "super-schema-types";

import { ALL_PERMISSIONS } from "@config/permissions";

import { Di } from "@enums/Di";
import { IRoleRepository } from "@interfaces/repositories/IRoleRepository";
import { AddEditRoleDto, UpdatePermissionDto } from "@dtos/AddEditRoleDto";

import { getInstanceOf } from "@helpers/getInstanceOf";

const permissionSchema: SuperSchemaElement<UpdatePermissionDto> = object({
  signature: string().required(),

  enabled: boolean().required(),
});

export const useAddEditBodySchema: (
  id?: number
) => SuperSchemaElement<AddEditRoleDto> = (id?: number) =>
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
          return ctx.createError({ message: "This name is not available." });
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
          }

          return false;
        }

        return true;
      }),
  });
