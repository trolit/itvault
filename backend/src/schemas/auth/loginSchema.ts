import { z } from "zod";

import { LoginDto } from "@dtos/LoginDto";
import { schemaForType } from "@helpers/schemaForType";
import { SchemaProvider, SuperSchemaRunner } from "@utils/types";

const bodySchemaProvider: SchemaProvider = () =>
  schemaForType<LoginDto>()(
    z.object({
      email: z
        .string()
        .email()
        .max(254) // @INFO https://www.rfc-editor.org/rfc/rfc5321#section-4.5.3
        .transform(value => value.toLowerCase()),
      password: z.string().max(100),
    })
  );

export const loginSchema: SuperSchemaRunner = () => {
  return {
    body: bodySchemaProvider,
  };
};
