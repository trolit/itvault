import { baseSchema } from "@schemas/Workspace/baseSchema";
import { paginationSchema } from "@schemas/common/paginationSchema";
import { SuperSchemaRunner, SchemaProvider } from "@custom-types/super-schema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

export const useGetAllSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  () => {
    return {
      params: useParamsSchema(),
      query: useQuerySchema(),
    };
  }
);

function useQuerySchema(): SchemaProvider {
  return () => paginationSchema;
}

function useParamsSchema(): SchemaProvider {
  return () => baseSchema.params;
}
