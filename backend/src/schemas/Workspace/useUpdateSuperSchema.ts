import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";

import { baseWorkspaceSchemas } from "./baseSchemas";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const { addEditBodySchema, workspaceAvailable } = baseWorkspaceSchemas;

export const useUpdateSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  () => {
    return {
      params: useParamsSchema(),
      body: useBodySchema(),
    };
  }
);

function useParamsSchema(): SchemaProvider {
  return () => workspaceAvailable("id");
}

function useBodySchema(): SchemaProvider {
  return () => addEditBodySchema;
}
