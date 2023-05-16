import isArray from "lodash/isArray";
import Zod, { RefinementCtx, z, ZodIssueCode, ZodSchema } from "zod";

import { Di } from "@enums/Di";
import { Role } from "@entities/Role";
import { UpdateUserDto } from "@dtos/UpdateUserDto";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { HEAD_ADMIN_ROLE_ID } from "@config/default-roles";
import { schemaForType } from "@schemas/common/schemaForType";
import { ISuperSchemaParams } from "@interfaces/ISuperSchemaParams";
import { IRoleRepository } from "@interfaces/repository/IRoleRepository";
import { SuperSchemaRunner, SchemaProvider } from "@schemas/common/types";

export const updateManySchema: SuperSchemaRunner = (
  commonParams: ISuperSchemaParams
) => {
  const {
    request: { userId, body },
  } = commonParams;

  return {
    body: useBodySchema(userId, body),
  };
};

function useBodySchema(
  userId: number,
  body: { value: UpdateUserDto[] }
): SchemaProvider {
  const createBodySchema = async (): Promise<ZodSchema> => {
    const { value } = body;

    const roles: Role[] =
      isArray(value) && value.some(element => !!element.data.roleId)
        ? await getRolesFromValue(value)
        : [];

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

    return schemaForType<{ value: UpdateUserDto[] }>()(
      z.object({
        value: z.array(updateUserDtoSchema).nonempty(),
      })
    );
  };

  return createBodySchema;
}

async function getRolesFromValue(value: UpdateUserDto[]): Promise<Role[]> {
  const uniqueRoleIds: number[] = value.reduce(
    (accumulator: number[], element) => {
      const roleId = element.data.roleId;

      if (roleId && !accumulator.includes(roleId)) {
        accumulator.push(roleId);
      }

      return accumulator;
    },
    []
  );

  if (uniqueRoleIds.length) {
    const roleRepository = getInstanceOf<IRoleRepository>(Di.RoleRepository);

    const [roles] = await roleRepository.getAll({
      filters: { ids: uniqueRoleIds },
    });

    return roles;
  }

  return [];
}
