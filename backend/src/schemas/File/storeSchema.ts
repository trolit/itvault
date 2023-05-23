import { z } from "zod";

import { schemaForType } from "@schemas/common/schemaForType";
import { SuperSchemaRunner, SchemaProvider } from "@custom-types/super-schema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

export const storeSchema: SuperSchemaRunner = defineSuperSchemaRunner(() => {
  return {
    params: useParamsSchema(),
  };
});

function useParamsSchema(): SchemaProvider {
  return () =>
    schemaForType<{ id: number }>()(
      z.object({
        id: z.coerce.number().gt(0),
      })
    );
}
