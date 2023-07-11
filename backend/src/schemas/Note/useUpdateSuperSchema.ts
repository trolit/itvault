import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";

import { schemaForType } from "@schemas/common/schemaForType";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

import { IBody, IParams } from "@controllers/Note/UpdateController";

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
    schemaForType<IParams>()(
      z.object({
        id: z.coerce.number().gt(0),
      })
    );
}

function useBodySchema(): SchemaProvider {
  return () =>
    schemaForType<IBody>()(
      z.object({
        text: z.string().transform(value => sanitizeHtml(value)),
      })
    );
}
