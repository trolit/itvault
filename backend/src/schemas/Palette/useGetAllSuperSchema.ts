import { baseSchemas } from "@schemas/Variant/baseSchemas";
import { SuperSchemaRunner, SchemaProvider } from "@custom-types/super-schema";
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
