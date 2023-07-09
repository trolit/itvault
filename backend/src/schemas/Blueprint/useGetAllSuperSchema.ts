import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";

import { baseSchemas } from "@schemas/Workspace/baseSchemas";
import { paginationSchema } from "@schemas/common/paginationSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const { workspaceIdSchema } = baseSchemas;

export const useGetAllSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  () => {
    return {
      query: useQuerySchema(),
    };
  }
);

function useQuerySchema(): SchemaProvider {
  return () => paginationSchema.merge(workspaceIdSchema);
}
