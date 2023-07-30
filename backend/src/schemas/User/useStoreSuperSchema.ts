import { object, string } from "yup";
import { SuperSchemaRunner, SuperSchemaElement } from "super-schema-types";
import { StoreControllerTypes } from "types/controllers/User/StoreController";

import { HEAD_ADMIN_ROLE_ID } from "@config/default-roles";

import { Di } from "@enums/Di";
import { IUserRepository } from "@interfaces/repositories/IUserRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const bodySchema: SuperSchemaElement<StoreControllerTypes.v1.Body> = object({
  email: string()
    .email()
    .max(254)
    .required()
    .transform(value => value.toLowerCase())
    .test(async (value, ctx) => {
      const userRepository = getInstanceOf<IUserRepository>(Di.UserRepository);

      const user = await userRepository.getOne({
        where: {
          email: value,
        },
        withDeleted: true,
      });

      if (user) {
        return ctx.createError({ message: "This email is not available." });
      }

      return true;
    }),

  firstName: string().required().min(2),

  lastName: string().required().min(2),

  roleId: useIdNumberSchema(Di.RoleRepository).test((value, ctx) => {
    if (value === HEAD_ADMIN_ROLE_ID) {
      return ctx.createError({ message: "This role is not assignable." });
    }

    return true;
  }),
});

export const useStoreSuperSchema: SuperSchemaRunner<
  void,
  StoreControllerTypes.v1.Body,
  void
> = defineSuperSchemaRunner(() => {
  return {
    body: bodySchema,
  };
});
