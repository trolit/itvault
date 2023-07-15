import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";

import { baseWorkspaceSchemas } from "./baseSchemas";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const { addEditBodySchema } = baseWorkspaceSchemas;

export const useStoreSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  () => {
    return {
      body: useBodySchema(),
    };
  }
);

function useBodySchema(): SchemaProvider {
  return () => addEditBodySchema;
}
