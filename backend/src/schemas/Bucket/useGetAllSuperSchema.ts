import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";

import { baseVariantSchemas } from "@schemas/Variant/baseSchemas";
import { baseWorkspaceSchemas } from "@schemas/Workspace/baseSchemas";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const { variantIdSchema } = baseVariantSchemas;
const { workspaceIdSchema } = baseWorkspaceSchemas;

export const useGetAllSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  () => {
    return {
      query: useQuerySchema(),
    };
  }
);

function useQuerySchema(): SchemaProvider {
  return () => variantIdSchema.merge(workspaceIdSchema);
}
