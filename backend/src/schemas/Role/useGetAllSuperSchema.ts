import { SuperSchemaRunner, SchemaProvider } from "@superSchema";

import { paginationSchema } from "@schemas/common/paginationSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

export const useGetAllSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  () => {
    return {
      query: useQuerySchema(),
    };
  }
);

function useQuerySchema(): SchemaProvider {
  return () => paginationSchema;
}
