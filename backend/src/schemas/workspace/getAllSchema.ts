import { paginationSchema } from "@schemas/common/paginationSchema";
import type { SuperSchemaRunner, SchemaProvider } from "@schemas/common/types";

export const getAllSchema: SuperSchemaRunner = () => {
  return {
    query: useQuerySchema(),
  };
};

function useQuerySchema(): SchemaProvider {
  return () => paginationSchema;
}
