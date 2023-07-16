import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";

import { baseRoleSchemas } from "./baseSchemas";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const { addEditBodySchema } = baseRoleSchemas;

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
