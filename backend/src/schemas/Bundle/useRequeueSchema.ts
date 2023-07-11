import { z } from "zod";
import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";

import { schemaForType } from "@schemas/common/schemaForType";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

export const useRequeueSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  () => {
    return {
      query: useQuerySchema(),
    };
  }
);

function useQuerySchema(): SchemaProvider {
  return () =>
    schemaForType<{ id: number }>()(
      z.object({
        id: z.coerce.number().gt(0),
      })
    );
}
