import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";
import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";

import { Di } from "@enums/Di";
import { AddEditUserDto } from "@dtos/AddEditUserDto";
import { IRoleRepository } from "@interfaces/repositories/IRoleRepository";
import { IUserRepository } from "@interfaces/repositories/IUserRepository";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { schemaForType } from "@schemas/common/schemaForType";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

export const useStoreSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  () => {
    return {
      body: useBodySchema(),
    };
  }
);

function useBodySchema(): SchemaProvider {
  return () =>
    schemaForType<AddEditUserDto>()(
      z.object({
        email: z
          .string()
          .email()
          .max(254)
          .transform(value => value.toLowerCase())
          .superRefine(async (value: string, context: RefinementCtx) => {
            const userRepository = getInstanceOf<IUserRepository>(
              Di.UserRepository
            );

            const user = await userRepository.getOne({
              where: {
                email: value,
              },
              withDeleted: true,
            });

            if (user) {
              context.addIssue({
                code: ZodIssueCode.custom,
                message: "This email is already in the system.",
              });

              return Zod.NEVER;
            }
          }),

        firstName: z.string().min(2),

        lastName: z.string().min(2),

        roleId: z
          .number()
          .gt(0)
          .superRefine(async (id: number, context: RefinementCtx) => {
            const roleRepository = getInstanceOf<IRoleRepository>(
              Di.RoleRepository
            );

            const role = await roleRepository.getById(id);

            if (!role) {
              context.addIssue({
                code: ZodIssueCode.custom,
                message: "This role is not available.",
              });

              return Zod.NEVER;
            }
          }),
      })
    );
}
