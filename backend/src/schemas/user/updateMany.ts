import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";

import { Permission } from "@enums/Permission";
import { SuperSchemaRunner } from "@utils/types";
import { UpdateUserDto } from "@dtos/UpdateUserDto";
import { schemaForType } from "@helpers/schemaForType";

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
            .superRefine((value: number, context: RefinementCtx) => {
              if (!permissions[Permission.ChangeUserRole]) {
                context.addIssue({
                  code: ZodIssueCode.custom,
                  message: "Missing permission to change account's role.",
                });

                return Zod.NEVER;
              }
            })
        ),
        isActive: z.optional(
          z.boolean().superRefine((value: boolean, context: RefinementCtx) => {
            if (value && !permissions[Permission.RestoreUserAccount]) {
              context.addIssue({
                code: ZodIssueCode.custom,
                message: "Missing permission to restore account.",
              });

              return Zod.NEVER;
            }

            if (!value && !permissions[Permission.DeactivateUserAccount]) {
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
