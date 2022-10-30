import { z } from "zod";
import { LoginDto } from "dtos/Login";
import { schemaForType } from "@helpers/schemaForType";

// @INFO https://github.com/colinhacks/zod/issues/372#issuecomment-826380330

export const loginSchema = schemaForType<LoginDto>()(
  z.object({
    email: z.string(),
    password: z.string(),
  })
);
