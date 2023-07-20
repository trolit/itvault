import { z } from "zod";
import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";

import { SignUpDto } from "@dtos/SignUpDto";

import { schemaForType } from "@schemas/common/schemaForType";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

export const useSignUpSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  () => {
    return {
      body: useBodySchema(),
    };
  }
);

function useBodySchema(): SchemaProvider {
  return () =>
    schemaForType<SignUpDto>()(
      z.object({
        id: z.number(),

        email: z
          .string()
          .email()
          .max(254)
          .transform(value => value.toLowerCase()),

        registrationCode: z.string(),

        password: z
          .string()
          .min(7)
          .regex(/[a-z]/, "At least one lowercase letter")
          .regex(/[A-Z]/, "At least one uppercase letter")
          .regex(/\d/, "At least one digit")
          .regex(
            /[*.!@#$%^&(){}[\]:;<>,.?/~_+-=|]/,
            "At least one special character"
          ),
      })
    );
}
