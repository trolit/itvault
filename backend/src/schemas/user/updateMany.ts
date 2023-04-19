import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";

import { SuperSchemaRunner } from "@utils/types";
import { UpdateUserDto } from "@dtos/UpdateUserDto";
import { schemaForType } from "@helpers/schemaForType";
import { HEAD_ADMIN_ROLE_ID } from "@config/default-roles";

const updateManyUsersSchemaRunner: SuperSchemaRunner = () => {
  const updateUserDtoSchema = schemaForType<UpdateUserDto>()(
    z.object({
      id: z.number().positive(),
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

export const updateManyUsersSchema = (() => {
  return updateManyUsersSchemaRunner;
})();
