import { SuperSchemaRunner, SchemaProvider } from "@superSchema";

import { baseSchemas } from "@schemas/Variant/baseSchemas";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

export const useGetAllSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  () => {
    return {
      params: useParamsSchema(),
    };
  }
);

function useParamsSchema(): SchemaProvider {
  return () => baseSchemas.params;
}
