import uniq from "lodash/uniq";
import isArray from "lodash/isArray";
import Zod, { RefinementCtx, z, ZodIssueCode, ZodSchema } from "zod";

import { Di } from "@enums/Di";
import { Role } from "@entities/Role";
import { instanceOf } from "@helpers/instanceOf";
import { UpdateUserDto } from "@dtos/UpdateUserDto";
import { schemaForType } from "@helpers/schemaForType";
import { HEAD_ADMIN_ROLE_ID } from "@config/default-roles";
import { SuperSchemaRunner } from "@utils/types";
import { ISuperSchemaParams } from "@interfaces/ISuperSchemaParams";
import { IRoleRepository } from "@interfaces/repository/IRoleRepository";

async function getBodySchema(
  userId: number,
  roles: Role[]
): Promise<ZodSchema> {
  const updateUserDtoSchema = schemaForType<UpdateUserDto>()(
    z.object({
      id: z
        .number()
        .positive()
        .superRefine((id: number, context: RefinementCtx) => {
          if (id === userId) {
            context.addIssue({
              code: ZodIssueCode.custom,
              message: "Can't change personal account.",
            });

            return Zod.NEVER;
          }
        }),
      data: z.object({
        roleId: z.optional(
          z
            .number()
            .positive()
            .superRefine((roleId: number, context: RefinementCtx) => {
              if (roleId === HEAD_ADMIN_ROLE_ID) {
                context.addIssue({
                  code: ZodIssueCode.custom,
                  message: "This role is not assignable.",
                });

                return Zod.NEVER;
              }

              const role = roles.find(role => role.id === roleId);

              if (!role) {
                context.addIssue({
                  code: ZodIssueCode.custom,
                  message: "Role is not available.",
                });

                return Zod.NEVER;
              }
            })
        ),
        isActive: z.optional(z.boolean()),
      }),
    })
  );

  return new Promise(() =>
    schemaForType<{ value: UpdateUserDto[] }>()(
      z.object({
        value: z.array(updateUserDtoSchema).nonempty(),
      })
    )
  );
}

const updateManyUsersSuperSchemaRunner: SuperSchemaRunner = async (
  commonParams: ISuperSchemaParams
) => {
  const {
    request: { userId, body },
  } = commonParams;

  return {
    body: async () => {
      const castedBody = <{ value: UpdateUserDto[] }>body;

      const { value } = castedBody;

      let requestedRoles: Role[] = [];

      if (isArray(value) && value.some(element => !!element.data.roleId)) {
        requestedRoles = await fetchRequestedRoles(value);
      }

      return getBodySchema(userId, requestedRoles);
    },
  };
};

export const updateManySchema = (() => {
  return updateManyUsersSuperSchemaRunner;
})();

async function fetchRequestedRoles(value: UpdateUserDto[]): Promise<Role[]> {
  const roleIds: number[] = [];

  for (const element of value) {
    if (element.data.roleId) {
      roleIds.push(element.data.roleId);
    }
  }

  if (roleIds.length) {
    const uniqueRoleIds = uniq<number>(roleIds);

    const roleRepository = instanceOf<IRoleRepository>(Di.RoleRepository);

    const [roles] = await roleRepository.getAll({
      filters: { ids: uniqueRoleIds },
    });

    return roles;
  }

  return [];
}
