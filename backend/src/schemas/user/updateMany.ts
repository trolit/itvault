import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";

import { Permission } from "@enums/Permission";
import { SuperSchemaRunner } from "@utils/types";
import { UpdateUserDto } from "@dtos/UpdateUserDto";
import { schemaForType } from "@helpers/schemaForType";
import { HEAD_ADMIN_ROLE, HEAD_ADMIN_ROLE_ID } from "@config/default-roles";

const updateManyUsersSchemaRunner: SuperSchemaRunner = commonParams => {
  const {
    request: { permissions },
  } = commonParams;

  const updateUserDtoSchema = schemaForType<UpdateUserDto>()(
    z.object({
      id: z.number().positive(),
      data: z.object({
        roleId: z.optional(
          z
            .number()
            .positive()
            .superRefine(async (roleId: number, context: RefinementCtx) => {
              if (!permissions[Permission.ChangeUserRole]) {
                context.addIssue({
                  code: ZodIssueCode.custom,
                  message: "Missing permission to change account's role.",
                });

                return Zod.NEVER;
              }

              if (roleId === HEAD_ADMIN_ROLE_ID) {
                context.addIssue({
                  code: ZodIssueCode.custom,
                  message: `${HEAD_ADMIN_ROLE.name} cannot be assigned to users.`,
                });

                return Zod.NEVER;
              }
            })
        ),
        isActive: z.optional(
          z
            .boolean()
            .superRefine((isActive: boolean, context: RefinementCtx) => {
              if (isActive && !permissions[Permission.RestoreUserAccount]) {
                context.addIssue({
                  code: ZodIssueCode.custom,
                  message: "Missing permission to restore account.",
                });

                return Zod.NEVER;
              }

              if (!isActive && !permissions[Permission.DeactivateUserAccount]) {
                context.addIssue({
                  code: ZodIssueCode.custom,
                  message: "Missing permission to deactivate account.",
                });

                return Zod.NEVER;
              }
            })
        ),
      }),
    })
  );

  return schemaForType<{ value: UpdateUserDto[] }>()(
    z.object({
      value: z.array(updateUserDtoSchema).nonempty(),
    })
  );
};

export const updateManyUsersSchema = (() => {
  return updateManyUsersSchemaRunner;
})();
