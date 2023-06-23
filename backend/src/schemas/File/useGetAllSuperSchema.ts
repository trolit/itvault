import { z } from "zod";
import { FILES } from "@config";

import { SuperSchemaRunner, SchemaProvider } from "@superSchema";

import { baseSchemas } from "@schemas/Workspace/baseSchemas";
import { schemaForType } from "@schemas/common/schemaForType";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

export const useGetAllSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  () => {
    return {
      params: useParamsSchema(),
      query: useQuerySchema(),
    };
  }
);

function useParamsSchema(): SchemaProvider {
  return () => baseSchemas.params;
}

function useQuerySchema(): SchemaProvider {
  return () =>
    schemaForType<{ relativePath?: string }>()(
      z.object({
        relativePath: z.string().default(FILES.ROOT),
      })
    );
}
