import { z } from "zod";

import { UpdateUserDto } from "@dtos/UpdateUserDto";
import { schemaForType } from "@helpers/schemaForType";

const updateUserDtoSchema = schemaForType<UpdateUserDto>()(
  z.object({
    id: z.number().positive(),
    data: z.object({
      roleId: z.optional(z.number().positive()),
      isActive: z.optional(z.boolean()),
    }),
  })
);

export const updateUsersSchema = schemaForType<{ value: UpdateUserDto[] }>()(
  z.object({
    value: z.array(updateUserDtoSchema).nonempty(),
  })
);
