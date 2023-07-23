import { z } from "zod";
import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";
import { SignInControllerTypes } from "types/controllers/Auth/SignInController";

import { schemaForType } from "@schemas/common/schemaForType";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

export const useSignInSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  () => {
    return {
      body: useBodySchema(),
    };
  }
);

function useBodySchema(): SchemaProvider {
  return () =>
    schemaForType<SignInControllerTypes.v1.Body>()(
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
