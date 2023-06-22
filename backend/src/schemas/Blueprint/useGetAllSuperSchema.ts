import { baseSchemas } from "@schemas/Workspace/baseSchemas";
import { paginationSchema } from "@schemas/common/paginationSchema";
import { SuperSchemaRunner, SchemaProvider } from "@superSchema";
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
  return () => baseSchemas.params;
}
