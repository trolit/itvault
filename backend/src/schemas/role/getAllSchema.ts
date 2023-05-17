import { paginationSchema } from "@schemas/common/paginationSchema";
import { SuperSchemaRunner, SchemaProvider } from "@custom-types/super-schema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

export const getAllSchema: SuperSchemaRunner = defineSuperSchemaRunner(() => {
  return {
    query: useQuerySchema(),
  };
});

function useQuerySchema(): SchemaProvider {
  return () => paginationSchema;
}
