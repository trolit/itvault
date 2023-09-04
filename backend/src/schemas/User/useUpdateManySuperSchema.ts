import { In } from "typeorm";
import { SuperSchema } from "types/SuperSchema";
import { array, boolean, number, object } from "yup";
import { IRoleRepository } from "types/repositories/IRoleRepository";
import { UpdateManyControllerTypes } from "types/controllers/User/UpdateManyController";

import { HEAD_ADMIN_ROLE_ID } from "@config/default-roles";

import { Di } from "@enums/Di";
import { Role } from "@entities/Role";
import { UpdateUserDto } from "@shared/types/dtos/UpdateUserDto";

import { setYupError } from "@helpers/yup/setError";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";
import { getUniqueValuesFromCollection } from "@helpers/getUniqueValuesFromCollection";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const useSingleValueSchema: (
  userId: number,
  roles: Role[]
) => SuperSchema.Fragment<UpdateUserDto> = (userId, roles) =>
  object({
    id: number()
      .integer()
      .required()
      .test((value, ctx) => {
        if (value === userId) {
          return ctx.createError({
            message: setYupError(
              CUSTOM_MESSAGES.USER.NO_PERSONAL_ACCOUNT_CHANGES
            ),
          });
        }

        return true;
      }),

    data: object({
      roleId: number()
        .optional()
        .test((value, ctx) => {
          if (value === HEAD_ADMIN_ROLE_ID) {
            return ctx.createError({
              message: setYupError(
                CUSTOM_MESSAGES.GENERAL.NOT_ASSIGNABLE,
                "role"
              ),
            });
          }

          const role = roles.find(role => role.id === value);

          if (!role) {
            return ctx.createError({
              message: setYupError(
                CUSTOM_MESSAGES.GENERAL.NOT_AVAILABLE,
                "role"
              ),
            });
          }

          return true;
        }),

      isActive: boolean().optional(),
    }).required(),
  });

const useBodySchema: (
  userId: number,
  body: UpdateManyControllerTypes.v1.Body
) => Promise<SuperSchema.Fragment<UpdateManyControllerTypes.v1.Body>> = async (
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

export const useUpdateManySuperSchema: SuperSchema.Runner<
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
  const uniqueRoleIds = getUniqueValuesFromCollection<UpdateUserDto, number>(
    value,
    "data.roleId"
  );

  if (uniqueRoleIds.length) {
    const roleRepository = getInstanceOf<IRoleRepository>(Di.RoleRepository);

    const [roles] = await roleRepository.getAllAndCount({
      where: {
        id: In(uniqueRoleIds),
      },
    });

    return roles;
  }

  return [];
}
