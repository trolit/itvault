import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";
import { UpdateControllerTypes } from "types/controllers/Note/UpdateController";

import { schemaForType } from "@schemas/common/schemaForType";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

export const useUpdateSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  () => {
    return {
      params: useParamsSchema(),
      body: useBodySchema(),
    };
  }
);

function useParamsSchema(): SchemaProvider {
  return () =>
    schemaForType<UpdateControllerTypes.v1.Params>()(
      z.object({
        id: z.coerce.number().gt(0),
      })
    );
}

function useBodySchema(): SchemaProvider {
  return () =>
    schemaForType<UpdateControllerTypes.v1.Body>()(
      z.object({
        text: z.string().transform(value => sanitizeHtml(value)),
      })
    );
}
