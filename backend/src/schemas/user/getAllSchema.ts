import { SchemaProvider, SuperSchemaRunner } from "@utils/types";
import { paginationSchema } from "@schemas/common/paginationSchema";

export const getAllSchema: SuperSchemaRunner = () => {
  return {
    query: useQuerySchema(),
  };
};

function useQuerySchema(): SchemaProvider {
  return () => paginationSchema;
}
