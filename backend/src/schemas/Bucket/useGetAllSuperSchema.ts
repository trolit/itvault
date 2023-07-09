import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";

import { baseVariantSchemas } from "@schemas/Variant/baseSchemas";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const { variantIdSchema } = baseVariantSchemas;

export const useGetAllSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  () => {
    return {
      query: useQuerySchema(),
    };
  }
);

function useQuerySchema(): SchemaProvider {
  return () => variantIdSchema;
}
