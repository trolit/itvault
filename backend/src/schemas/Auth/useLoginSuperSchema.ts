import { z } from "zod";
import { Body } from "types/controllers/v1/Auth/LoginController";
import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";

import { schemaForType } from "@schemas/common/schemaForType";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

export const useLoginSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  () => {
    return {
      body: useBodySchema(),
    };
  }
);

function useBodySchema(): SchemaProvider {
  return () =>
    schemaForType<Body>()(
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
