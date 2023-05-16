import { z } from "zod";

import { LoginDto } from "@dtos/LoginDto";
import { schemaForType } from "@schemas/common/schemaForType";
import { SuperSchemaRunner, SchemaProvider } from "@schemas/common/types";

export const loginSchema: SuperSchemaRunner = () => {
  return {
    body: useBodySchema(),
  };
};

function useBodySchema(): SchemaProvider {
  return () =>
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
}
