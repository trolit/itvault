import { In } from "typeorm";
import { array, boolean, number, object } from "yup";
import { SuperSchemaElement, SuperSchemaRunner } from "super-schema-types";
import { UpdateManyControllerTypes } from "types/controllers/User/UpdateManyController";

import { HEAD_ADMIN_ROLE_ID } from "@config/default-roles";

import { Di } from "@enums/Di";
import type { Role } from "@entities/Role";
import type { UpdateUserDto } from "@dtos/UpdateUserDto";
import { IRoleRepository } from "@interfaces/repositories/IRoleRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const useSingleValueSchema: (
  userId: number,
  roles: Role[]
) => SuperSchemaElement<UpdateUserDto> = (userId, roles) =>
  object({
    id: number()
      .integer()
      .required()
      .test((value, ctx) => {
        if (value === userId) {
          return ctx.createError({ message: "Can't change personal account." });
        }

        return true;
      }),

    data: object({
      roleId: number()
        .optional()
        .test((value, ctx) => {
          if (value === HEAD_ADMIN_ROLE_ID) {
            return ctx.createError({ message: "This role is not assignable." });
          }

          const role = roles.find(role => role.id === value);

          if (!role) {
            return ctx.createError({ message: "This role is not available." });
          }

          return true;
        }),

      isActive: boolean().optional(),
    }).required(),
  });

const useBodySchema: (
  userId: number,
  body: UpdateManyControllerTypes.v1.Body
) => Promise<SuperSchemaElement<UpdateManyControllerTypes.v1.Body>> = async (
  userId,
  body
) => {
  const { values } = body;

  const roles: Role[] = await getRolesFromValue(values);

  const singleValueSchema = useSingleValueSchema(userId, roles);

  return object({
    values: array().of(singleValueSchema).required(),
  });
};

export const useUpdateManySuperSchema: SuperSchemaRunner<
  void,
  UpdateManyControllerTypes.v1.Body,
  void
> = defineSuperSchemaRunner(async ({ request }) => {
  const { userId, body } = request;

  return {
    body: await useBodySchema(userId, body),
  };
});

async function getRolesFromValue(value: UpdateUserDto[]): Promise<Role[]> {
  // @NOTE consider using nested helper
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
      where: {
        id: In(uniqueRoleIds),
      },
    });

    return roles;
  }

  return [];
}
